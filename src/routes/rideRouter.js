const rideRouter = require("express").Router();
// const isAUth = require("../middlewares/isAuth");
const {
  createRide,
  searchForRides,
  fetchRidesByIds,
  fetchAllUnrequestedRides,
  getRidesByDriverId,
  cancelRide,
  getPassengerScheduledRides,
} = require("../controllers/rideController");
const {
  getPassengerRideHistoryController,
  getDriverRideHistoryController,
} = require("../controllers/rideHistoryController");

// rideRouter.use(isAUth);
rideRouter.post("/", createRide);
rideRouter.put("/", cancelRide);
//change this to a get req in future
rideRouter.post("/all", fetchAllUnrequestedRides);

rideRouter.get("/", searchForRides);
rideRouter.get("/driver", getRidesByDriverId);
rideRouter.get("/passenger", getPassengerScheduledRides);
rideRouter.get("/byIds", fetchRidesByIds);

rideRouter.get("/history-passenger", getPassengerRideHistoryController);
rideRouter.get("/history-driver", getDriverRideHistoryController);

module.exports = { rideRouter };
