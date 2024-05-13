const { Ride } = require("../models/Ride");
const { RideOccurence } = require("../models/RideOccurence");
const { RideRequest } = require("../models/RideRequest");
const { User } = require("../models/User");
const sendPushNotifications = require("../../pushNotifications");

const createRequest = async (req, res) => {
  console.log("==================");
  console.log("Create Request of ride  received ");

  const { passengerLocation, RideOccurenceId } = req.body;
  const validatedRequestPayload = {
    ...req.body,
    passengerLocation: {
      type: "Point",
      coordinates: [passengerLocation.latitude, passengerLocation.longitude],
    },
  };

  try {
    //fetch all details abt ride occ = parent ride - user driver - user preferences
    const request = await RideRequest.create(validatedRequestPayload);

    const rideOcc = await RideOccurence.findByPk(RideOccurenceId, {
      attributes: ["RideId"],
    });
    const ride = await Ride.findByPk(rideOcc.RideId, {
      attributes: ["driverFirebaseId"],
    });

    const driver = await User.findByPk(ride.driverFirebaseId, {
      attributes: ["exponentPushToken"],
    });
    await sendPushNotifications(
      [driver.exponentPushToken], // Pass the push token as a string in an array
      "You have received a ride request",
      { withSome: "data" } // You can also pass additional data as an object
    );

    return res.sendStatus(200);
  } catch (error) {
    console.log("==================");
    console.error("Error creating request rides ", error);
    return res.status(500).json({ error: error.message });
  }
};
//accepts or declines requests
const handleRequestResponse = async (req, res) => {
  console.log("==================");
  console.log("accept / decline passenger request received ");

  const { id: requestId, isAccepted } = req.body;

  try {
    //accepted -> status=1 / declined -> status=-1
    await RideRequest.update(
      { status: isAccepted ? 1 : -1 },
      { where: { id: requestId } }
    );

    const request = await RideRequest.findByPk(requestId);

    const rideOcc = await RideOccurence.findByPk(request.RideOccurenceId, {
      attributes: ["RideId"],
    });
    const ride = await Ride.findByPk(rideOcc.RideId, {
      attributes: ["driverFirebaseId"],
    });

    const passenger = await User.findByPk(ride.driverFirebaseId, {
      attributes: ["exponentPushToken"],
    });
    await sendPushNotifications(
      [passenger.exponentPushToken], // Pass the push token as a string in an array
      `Your request has been ${isAccepted ? "accepted" : "declined"}`,
      { withSome: "data" } // You can also pass additional data as an object
    );

    return res.sendStatus(200);
  } catch (error) {
    console.log("==================");
    console.error("Error creating request rides ", error);
    return res.status(500).json({ error: error.message });
  }
};
module.exports = { createRequest, handleRequestResponse };
