const userRouter = require("express").Router();
const {
  signUp,
  setPreferences,
  getPreferences,
  getUser,
  updateUser
} = require("../controllers/userController");

userRouter.post("/signup", signUp);
userRouter.post("/preferences", setPreferences);
userRouter.get("/preferences", getPreferences);
userRouter.get("/user", getUser)
userRouter.put("/user", updateUser)

module.exports = { userRouter };
