const rideRouter = require("express").Router();
const isAUth = require("../../middlewares/isAuth");
const { createRide, searchForRides } = require("../controllers/rideController");

// rideRouter.use(isAUth);
rideRouter.post("/", createRide);
rideRouter.get("/", searchForRides);

module.exports = { rideRouter };
