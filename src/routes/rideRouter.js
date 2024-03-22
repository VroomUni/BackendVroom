const rideRouter = require("express").Router();
const isAUth = require("../../middlewares/isAuth");
const { createRide } = require("../controllers/rideController");

// rideRouter.use(isAUth);
rideRouter.post("/", createRide);
// userRouter.get("/offer", getPostedOffers); //retrieves orders too
// userRouter.delete("/offer", deleteOffer);
// userRouter.put("/profile", updateProfile);
// userRouter.get("/profile", getBuisnessProfile);
// userRouter.put("/offer", updateOffer);
// userRouter.get("/order/:order_id", getScannedOrder);

module.exports = { rideRouter };
