const userRouter = require("express").Router();
const {
  signUp,

  signIn,
} = require("../controllers/userController");

userRouter.post("/signup", signUp);
// userRouter.get("/offer", getPostedOffers); //retrieves orders too
// userRouter.delete("/offer", deleteOffer);
// userRouter.put("/profile", updateProfile);
// userRouter.get("/profile", getBuisnessProfile);
// userRouter.put("/offer", updateOffer);
// userRouter.get("/order/:order_id", getScannedOrder);

module.exports = { userRouter };
