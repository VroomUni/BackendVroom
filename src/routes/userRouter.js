const userRouter = require("express").Router();
const {
  signUp,
  addOffer,
  getPostedOffers,
  deleteOffer,
  updateProfile,
  updateOffer,
  getBuisnessProfile,
  getScannedOrder,
  signIn,
} = require("../controllers/userController");

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
// userRouter.post("/offer", addOffer);
// userRouter.get("/offer", getPostedOffers); //retrieves orders too
// userRouter.delete("/offer", deleteOffer);
// userRouter.put("/profile", updateProfile);
// userRouter.get("/profile", getBuisnessProfile);
// userRouter.put("/offer", updateOffer);
// userRouter.get("/order/:order_id", getScannedOrder);

module.exports = {  userRouter };
