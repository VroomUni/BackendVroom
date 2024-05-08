const userRouter = require("express").Router();
const uploads =require("../middlewares/multer");
const {
  signUp,
  setPreferences,
  getPreferences,
  uploadUserImage,
  setExpoPushToken
} = require("../controllers/userController");

userRouter.post("/signup", signUp);
userRouter.post("/token", setExpoPushToken);
userRouter.post("/preferences", setPreferences);
userRouter.get("/preferences", getPreferences);
userRouter.post("/upload-image", uploads.single("image"),uploadUserImage);

module.exports = { userRouter };
