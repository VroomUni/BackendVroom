// historyController.js
const {
  getPassengerRideHistory,
  getDriverRideHistory,
} = require("../services/HistoryService");

const getPassengerRideHistoryController = async (req, res) => {
  const { passengerId } = req.query;

  try {
    console.log("Search Passenger History rides req received");
    const rideHistory = await getPassengerRideHistory(passengerId);
    return res.status(200).json(rideHistory);
  } catch (error) {
    console.error("Error fetching ride history:", error);
    return res.status(500).json({ error: "Failed to fetch ride history" });
  }
};

const getDriverRideHistoryController = async (req, res) => {
  console.log("get Driver Ride history Req received");
  const { driverId } = req.query;
  try {
    const driverRideHistory = await getDriverRideHistory(driverId);
    return res.status(200).json(driverRideHistory);
  } catch (error) {
    console.error("Error fetching driver ride history:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch driver ride history" });
  }
};

module.exports = {
  getPassengerRideHistoryController,
  getDriverRideHistoryController,
};
