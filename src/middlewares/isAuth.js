const isAUth = (req, res, next) => {
  console.log("Auth Middleware checking user");

  const { firebaseId } = req.body;

  if (!firebaseId) {
    console.log("Request rejected , not authorized ");
    console.log("================================= ");

    return res.status(401).json({ msg: "please login " });
  }
  return next();
};

module.exports = isAUth;
