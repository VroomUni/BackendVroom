const rideRouter = require("express").Router();
const isAUth = require("../../middlewares/isAuth");
const {
  createRide,
  searchForRides,
  fetchRidesByIds,
} = require("../controllers/rideController");

// rideRouter.use(isAUth);
rideRouter.post("/", createRide);
rideRouter.get("/", searchForRides);
rideRouter.get("/byIds", fetchRidesByIds);

module.exports = { rideRouter };
