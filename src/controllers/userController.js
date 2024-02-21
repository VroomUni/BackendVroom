const { User } = require("../models/User");
const {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} = require("firebase/auth");

const auth = getAuth();

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
  };

  try {
    const newUser = await User.create(userInfo);
    const FbaseUser = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      newUser.password
    );
    newUser.firebaseId = FbaseUser.user.uid;

    await newUser.save();
    await sendEmailVerification(FbaseUser.user);

    // const emailSent = await getAuth;
    console.log("==================");
    console.log("new user created:" + JSON.stringify(newUser));

    return res.status(200).json({
      msg: "Successful insertion , redirect to home ",
      inserted: { FbaseUser },
    });
  } catch (error) {
    console.log("==================");
    console.error("Error creating user:", error);
    return res.status(500).json(error);
  }
};

const signIn = async (req, res) => {
  console.log("signIn request received ");
  const userInfo = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const FbaseUser = await signInWithEmailAndPassword(
      auth,
      userInfo.email,
      userInfo.password
    );

    // const emailSent = await getAuth;
    console.log("==================");
    console.log(" user logged in:" + JSON.stringify(FbaseUser));

    return res.status(200).json({
      msg: "Successful login ",
      inserted: { FbaseUser },
    });
  } catch (error) {
    console.log("==================");
    console.error("Error logging in user:", error);
    return res.status(500).json(error);
  }
};
module.exports = { signUp, signIn };
