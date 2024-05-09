const { RideRequest } = require("../models/RideRequest");

const createRequest = async (req, res) => {
  console.log("==================");
  console.log("Create Request of ride  received ");

  const { passengerLocation } = req.body;
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

    return res.status(200).json({});
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
    const [affectedRowsCount, affectedRows] = await RideRequest.update(
      { status: isAccepted ? 1 : -1 },
      { where: { id: requestId } }
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log("==================");
    console.error("Error creating request rides ", error);
    return res.status(500).json({ error: error.message });
  }
};
module.exports = { createRequest, handleRequestResponse };