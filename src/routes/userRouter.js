const userRouter = require("express").Router();
const uploads =require("../middlewares/multer");
const {
  signUp,
  setPreferences,
  getPreferences,
  uploadUserImage,
  createCar,
  getCar,
} = require("../controllers/userController");

userRouter.post("/signup", signUp);
userRouter.post("/preferences", setPreferences);
userRouter.get("/preferences", getPreferences);
userRouter.post("/upload-image", uploads.single("image"),uploadUserImage);
userRouter.post("/car", createCar);
userRouter.post("/car", getCar);


module.exports = { userRouter };