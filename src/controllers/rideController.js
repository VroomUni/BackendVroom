const { Recurrence } = require("../models/Recurrence");
const { Ride } = require("../models/Ride");

const createRide = async (req, res) => {
  console.log("createRide request received ");

  try {
    const { recurrence, ...rideObj } = req.body;
    const newRide = await Ride.create(
      { ...rideObj, Recurrence: recurrence },
      { include: Recurrence }
    );
    console.log(recurrence);
   
    console.log("==================");
    console.log(" ride : SUCCESS  ");

    return res.status(200).json({
      msg: "Successful Ride creation ",
      // inserted: { FbaseUser },
    });
  } catch (error) {
    console.log("==================");
    console.error("Error logging in user:", error);
    return res.status(500).json(error);
  }
};

module.exports = { createRide };
