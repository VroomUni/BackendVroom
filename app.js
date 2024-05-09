const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connectDb } = require("./src/config/db");
const { userRouter } = require("./src/routes/userRouter");
const { rideRouter } = require("./src/routes/rideRouter");
const { requestRouter } = require("./src/routes/requestRouter");
const ratingRoutes = require("./src/routes/ratingRoutes"); // Import ratingRoutes
const sendPushNotifications = require("./pushNotifications");

const port = process.env.PORT;
connectDb();

app.use(express.json());
//routes and api design to be updated
app.use("/api/user", userRouter);
app.use("/api/ride", rideRouter);
app.use("/api/request", requestRouter);
app.use("/api/rate", ratingRoutes); // Use ratingRoutes

app.all("/api", async (req, res) => {
  await sendPushNotifications(
    ["ExponentPushToken[bRblD0F250TZeEYUsW-tAS]"], // Pass the push token as a string in an array
    "this is body",
    { withSome: 'data' }  // You can also pass additional data as an object
  );
  
  res.json("hello world").status(200);
});

const server = app.listen(port, () => {
  console.log("listening on " + port);
});
