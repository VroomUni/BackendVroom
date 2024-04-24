const userRouter = require("express").Router();
const {
  signUp,
  setPreferences,
  getPreferences,
  getUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

userRouter.post("/signup", signUp);
userRouter.post("/preferences", setPreferences);
userRouter.get("/preferences", getPreferences);
userRouter.get("/user/:firebaseId", getUser)
userRouter.put("/user/:firebaseId", updateUser)
userRouter.delete("/user/:firebaseId",deleteUser)
module.exports = { userRouter };
