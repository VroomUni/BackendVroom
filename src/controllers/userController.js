const { Preference } = require("../models/Preferences");
const { User } = require("../models/User");

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

module.exports = { signUp, setPreferences };
