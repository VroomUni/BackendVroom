const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connectDb } = require("./config/db");
const { User } = require("./models/User");

const port = process.env.PORT;
connectDb();



app.all("/api", (req, res) => {
  console.log("hello");
  res.sendStatus(200);
});



const server = app.listen(port, () => {
  console.log("listening on " + port);
});
