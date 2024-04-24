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

const getPreferences = async (req, res) => {
  console.log("preferences request received ");
  const { userId } = req.query;

  try {
    const userPrefs = await Preference.findOne({
      where: { UserFirebaseId: userId },
      attributes: { exclude: ["id" , "UserFirebaseId"] },
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

const getUser = async (req,res) =>{
  console.log("user retrieval request received")
  const {userId} = req.query
  try {
    const user = await User.findOne({
      where:{UserFirebaseId: userId},
      attributes:{exclude:["firebaseId,"]}
    });
    console.log("user general information fetched: " +JSON.stringify(user))
    return res.status(200).json(user)
  }catch{
    console.log("error retrieving user",error);
    return res.status(500).json(error)
  }
}

const updateUser = async (req, res) =>{
  console.log("Update request received")
  const {userId} = req.query 
  const updateData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    profilePicPath: req.body.profilePicPath
  };
  try{
    const user = await User.findOne({
      where:{UserFirebaseId: userId},
    })
    if(!user){
      return res.status(404).json({msg: " user not found"})
    }
    const updatedUser = await user.update(updateData)
    console.log("user updated: "+ JSON.stringify(updatedUser))
    return res.status(200).json(updatedUser)
  }catch(error){
    console.log("error updating user",error)
    return res.status(500),json(error)
  }
}

const deleteUser = async (req,res) =>{
  const {userId} = req.query
  try{
    const user = await User.findOne({
      where:{firebaseId: userId}
    })
    if(!user){
      return res.status(404).json({msg:"User not found"})
    }
    await user.destroy();
    console.log("User deleted successfully");
    return res.status(200).json({msg: "User deleted successfully"})
  }catch (error){
    console.error("error deleting user",error)
    return res.status(500).json({error:"failed to delete user"})
  }
}
module.exports = { signUp, setPreferences, getPreferences, getUser,updateUser,deleteUser };
