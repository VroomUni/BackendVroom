const userRouter = require("express").Router();
const uploads = require("../middlewares/multer");
const {
  signUp,
  setPreferences,
  getPreferences,
  uploadUserImage,
  setExpoPushToken,
  createCar,
  getCar,
  getUser,
  updateUser,
  deleteUser,
  updateCar,
  updatePreferences,
  deletePushToken,
} = require("../controllers/userController");

userRouter.post("/signup", signUp);
userRouter.post("/token", setExpoPushToken);
userRouter.delete("/token", deletePushToken);
userRouter.post("/preferences", setPreferences);
userRouter.get("/preferences", getPreferences);
userRouter.post("/upload-image", uploads.single("image"), uploadUserImage);
userRouter.post("/car", createCar);
userRouter.get("/car", getCar);
userRouter.get("/info", getUser);
userRouter.put("/info", updateUser);
userRouter.delete("/info", deleteUser);
userRouter.put("/car", updateCar);
userRouter.put("/preferences", updatePreferences);

module.exports = { userRouter };
