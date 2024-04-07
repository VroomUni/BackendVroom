const userRouter = require("express").Router();
const { signUp, setPreferences } = require("../controllers/userController");

userRouter.post("/signup", signUp);
userRouter.post("/preferences", setPreferences);

module.exports = { userRouter };
