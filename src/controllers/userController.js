const { Preference } = require("../models/Preferences");
const { User } = require("../models/User");
const { Car } = require("../models/Car");
const { json } = require("sequelize");

const signUp = async (req, res) => {
  console.log("signup request received ");
  const userInfo = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender,
    profilePicPath: req.body.profilePicPath,
    firebaseId: req.body.firebaseId,
    //to add this after signup karim
    // exponentPushToken: req.body.exponentPushtoken,
  };

  try {
    const newUser = await User.create(userInfo);

    console.log("==================");
    console.log("new user created:" + JSON.stringify(newUser));

    return res.status(200).json({
      msg: "Successful insertion , redirect to home ",
      inserted: { newUser: newUser.dataValues },
    });
  } catch (error) {
    console.log("==================");
    console.error("Error creating user:", error);
    return res.status(500).json({ error: error.message });
  }
};

const setPreferences = async (req, res) => {
  const girlsBoysObjHelper = () => {
    const { boysOnly, girlsOnly } = req.body;
    if (!(boysOnly && girlsOnly)) {
      const result = {};
      if (boysOnly) {
        result.boysOnly = boysOnly;
      }
      if (girlsOnly) {
        result.girlsOnly = girlsOnly;
      }
      return result;
    }
  };
  console.log("preferences request received ");
  const preferencesInfo = {
    smoking: req.body.smoking,
    talkative: req.body.talkative,
    loudMusic: req.body.loudMusic,
    foodFriendly: req.body.foodFriendly,
    UserFirebaseId: req.body.UserFirebaseId,
    ...girlsBoysObjHelper(),
  };

  try {
    const newPreferences = await Preference.create(preferencesInfo);

    console.log("==================");
    console.log("new preferences created:" + JSON.stringify(newPreferences));

    return res.sendStatus(200);
  } catch (error) {
    console.log("==================");
    console.error("Error creating preferences:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getPreferences = async (req, res) => {
  console.log("preferences request received ");
  const { userId } = req.query;

  try {
    const userPrefs = await Preference.findOne({
      where: { UserFirebaseId: userId },
      attributes: { exclude: ["id", "UserFirebaseId"] },
    });

    console.log("==================");
    console.log(" preferences fetched:" + JSON.stringify(userPrefs));

    return res.status(200).json(userPrefs);
  } catch (error) {
    console.log("==================");
    console.error("Error creating preferences:", error);
    return res.status(500).json({ error: error.message });
  }
};

const uploadUserImage = async (req, res) => {
  try {
    console.log("upload img received");
    // Check if file is uploaded
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded!" });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully!",
      imagePath: req.file.path,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Error uploading image!" });
  }
};
const createCar = async (req, res) => {
  console.log("car request received ");
  const carInfo = {
    brand: req.body.brand,
    model: req.body.model,
    color: req.body.color,
    UserFirebaseId: req.body.UserFirebaseId,
  };

  try {
    const car = await Car.create(carInfo);
    console.log("==================");
    console.log("new car created:" + JSON.stringify(carInfo));
    return res.status(200).json(car);
  } catch (error) {
    console.log("==================");
    console.error("Error creating car:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCar = async (req, res) => {
  const { UserFirebaseId } = req.params.firebaseId;
  try {
    const car = await Car.findOne({ where: UserFirebaseId });
    if (car) {
      return res.status(200).json(car);
    }
    throw new Error("Car not found");
  } catch (error) {
    console.error("Error fetching car by user ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// get user information
const getUser = async (req, res) => {
  console.log("user retrieval request received");
  const { userId } = req.query;
  console.log("userid", userId);
  try {
    const user = await User.findOne({
      where: { firebaseId: userId },
      attributes: { exclude: ["firebaseId"] },
    });
    console.log(user);
    if (!user) {
      console.log("No user found with the given ID");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User general information fetched: " + JSON.stringify(user));
    return res.status(200).json(user);
  } catch (error) {
    console.log("error retrieving user:", error);
    return res.status(500).json("error:", error.message);
  }
};

//update user information
const updateUser = async (req, res) => {
  console.log("update request received");
  const { userId } = req.query;
  const updateData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    profilePicPath: req.body.profilePicPath,
  };
  console.log(updateData);
  try {
    const user = await User.findOne({
      where: { firebaseId: userId },
    });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    const updatedUser = await user.update(updateData);
    // console.log("user updated: " + JSON.stringify(updatedUser));
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error updating user");
    return res.status(500).json("error:", error.message);
  }
};

//delete user
const deleteUser = async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({
      where: { firebaseId: userId },
    });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }
    await user.destroy();
    console.log("user deleted succesfully");
    return res.status(200).json({ msg: "user deleted succesfully" });
  } catch (error) {
    console.error("error deleting user", error.message);
    return res.status(500).json("failed to delete user", error.message);
  }
};
// update car information
const updateCar = async (req, res) => {
  console.log("update car request received");
  const { userId } = req.query;
  const updateData = {
    brand: req.body.brand,
    model: req.body.model,
    color: req.body.color,
  };
  try {
    const car = await Car.findOne({
      where: { firebaseId: userId },
    });
    if (!car) {
      return res.status(404).json({ msg: "car not found" });
    }
    const updatedCar = await car.update(updateData);
    console.log("car updated:" + JSON.stringify(updatedCar));
    return res.status(200).json(updatedCar);
  } catch (error) {
    console.log("error update car", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//update preferences
const updatePreferences = async (req, res) => {
  console;
  const { userId } = req.query;
  const updateData = {
    smoking: req.body.smoking,
    talkative: req.body.talkative,
    loudMusic: req.body.loudMusic,
    foodFriendly: req.body.foodFriendly,
    girlsOnly: req.body.girlsOnly,
    boysOnly: req.body.boysOnly,
  };
  try {
    const userPrefs = await Preference.findOne({
      where: { UserFirebaseId: userId },
    });
    if (!userPrefs) {
      return res.status(404).json({ msg: "preferences not found" });
    }
    const updatedPreferences = await userPrefs.update(updateData);
    return res.status(200).json(updatedPreferences);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const setExpoPushToken = async (req, res) => {
  console.log("Set Token req received");
  const { token, userId } = req.body;

  try {
    User.update(
      { exponentPushToken: token },
      { where: { firebaseId: userId } }
    );
    res.sendStatus(200);
  } catch (error) {
    console.error("Error Setting user token:", error);
    res.status(500).json(error);
  }
};

const deletePushToken = async (req, res) => {
  console.log("delete token received");
  const { userId } = req.query;
  try {
    await User.update(
      { exponentPushToken: null },
      { where: { firebaseId: userId } }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

module.exports = {
  signUp,
  setPreferences,
  getPreferences,
  uploadUserImage,
  setExpoPushToken,
  createCar,
  getCar,
  updateCar,
  getUser,
  updateUser,
  deleteUser,
  updatePreferences,
  deletePushToken,
};
