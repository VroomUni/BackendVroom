const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connectDb } = require("./config/db");
const { userRouter } = require("./routes/userRouter");
const { rideRouter } = require("./routes/rideRouter");
const { historyRouter } = require("./routes/historyRouter");
const { historyDriverRouter } = require("./routes/historyRouter"); 

connectDb();
const port = process.env.PORT;


app.use(express.json());
//routes and api design to be updated
app.use("/api/history", historyRouter);
app.use("/api/user",userRouter);
app.use("/api/ride",rideRouter)
app.use("/api/history-driver", historyDriverRouter); // Use historyDriverRouter for driver history

//default route
app.all("/api", (req, res) => {
  res.json("hello world").status(200);
});



const server = app.listen(port, () => {
  console.log("listening on " + port);
});

module.exports = { app, server };

