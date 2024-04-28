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

// historyController.js

const getDriverRideHistoryController = async (req, res) => {
  const { driverFirebaseId } = req.params;

  try {
    const rideHistory = await getDriverRideHistory(driverFirebaseId);
    return res.status(200).json({ rideHistory });
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
