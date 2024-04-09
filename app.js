const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connectDb } = require("./src/config/db");
const { userRouter } = require("./src/routes/userRouter");
const { rideRouter } = require("./src/routes/rideRouter");
const { requestRouter } = require("./src/routes/requestRouter");

const port = process.env.PORT;
connectDb();

app.use(express.json());
//routes and api design to be updated
app.use("/api/user", userRouter);
app.use("/api/ride", rideRouter);
app.use("/api/request", requestRouter);

app.all("/api", (req, res) => {
  res.json("hello world").status(200);
});

const server = app.listen(port, () => {
  console.log("listening on " + port);
});
