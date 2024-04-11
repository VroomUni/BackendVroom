const rideRouter = require("express").Router();
const isAUth = require("../middlewares/isAuth");
const {
  createRide,
  searchForRides,
  fetchRidesByIds,
  fetchAllUnrequestedRides,
  getRidesByDriverId
} = require("../controllers/rideController");

// rideRouter.use(isAUth);
rideRouter.post("/", createRide);
//change this to a get req in future
rideRouter.post("/all", fetchAllUnrequestedRides);

rideRouter.get("/", searchForRides);
rideRouter.get("/driver", getRidesByDriverId);
rideRouter.get("/byIds", fetchRidesByIds);

module.exports = { rideRouter };
