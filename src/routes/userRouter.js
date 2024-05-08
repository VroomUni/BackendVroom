const userRouter = require("express").Router();
const uploads =require("../middlewares/multer");
const {
  signUp,
  setPreferences,
  getPreferences,
  uploadUserImage,
  createCar,
  getCar,
  getUser,
  updateUser,
  deleteUser,
  updateCar,
  updatePreferences,
} = require("../controllers/userController");

userRouter.post("/signup", signUp);
userRouter.post("/preferences", setPreferences);
userRouter.get("/preferences", getPreferences);
userRouter.post("/upload-image", uploads.single("image"),uploadUserImage);
userRouter.post("/car", createCar);
userRouter.post("/car", getCar);
userRouter.get("/user",getUser);
userRouter.put("/user",updateUser);
userRouter.delete("/user",deleteUser);
userRouter.put("/car",updateCar);
userRouter.put("/preferences",updatePreferences)

module.exports = { userRouter };