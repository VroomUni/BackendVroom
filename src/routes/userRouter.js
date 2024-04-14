const userRouter = require("express").Router();
const {
  signUp,
  setPreferences,
  getPreferences,
} = require("../controllers/userController");

userRouter.post("/signup", signUp);
userRouter.post("/preferences", setPreferences);
userRouter.get("/preferences", getPreferences);

module.exports = { userRouter };
