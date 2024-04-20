// // historyController.js
// const{ getPassengerRideHistory } = require("../services/HistoryService");
// const getPassengerRideHistoryController = async (req, res) => {
//   const { firebaseId } = req.params;

//   try {
//     const rideHistory = await getPassengerRideHistory(firebaseId);
//     return res.status(200).json({ rideHistory });
//   } catch (error) {
//     console.error("Error fetching ride history:", error);
//     return res.status(500).json({ error: "Failed to fetch ride history" });
//   }
// };

// module.exports = { getPassengerRideHistoryController };
