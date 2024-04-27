const { Preference } = require("../models/Preferences");
const { User } = require("../models/User");
const { Car } = require('../models/Car');

const signUp = async (req, res) => {
  console.log("signup request received ");
  const userInfo = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
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
    return res.status(500).json(error);
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
    return res.status(500).json(error);
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
    return res.status(500).json(error);
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
    console.error('Error creating car:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getCar = async (req, res) => {
  const { UserFirebaseId } = req.params.firebaseId;
  try {
    const car = await Car.findOne({ where:  UserFirebaseId  });
    if (car) {
      return res.status(200).json(car);
    }
    throw new Error('Car not found');
  } catch (error) {
    console.error('Error fetching car by user ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { signUp, setPreferences, getPreferences, uploadUserImage, createCar, getCar };
