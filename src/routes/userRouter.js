const userRouter = require("express").Router();
const {
  signUp,
  setPreferences,
  getPreferences,
  getUser,
  updateUser,
  deleteUser,
  updatePreferences,
  getCar,
  updateCar
} = require("../controllers/userController");

userRouter.post("/signup", signUp);
userRouter.post("/preferences", setPreferences);
userRouter.get("/preferences", getPreferences);
userRouter.get("/user/:firebaseId", getUser)
userRouter.put("/user/:firebaseId", updateUser)
userRouter.delete("/user/:firebaseId",deleteUser)
userRouter.put("/preferences/:firebaseId",updatePreferences)
userRouter.get("/car/:firebaseId",getCar)
userRouter.put("/car/:firebaseId",updateCar)
module.exports = { userRouter };
