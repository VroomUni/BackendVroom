const ratingRouter = require("express").Router();
const uploads = require("../middlewares/multer");

const { createDriverRating, createPassengerRating } = require("../controllers/ratingController");

ratingRouter.post("/driver", createDriverRating);
ratingRouter.post("/passenger", createPassengerRating);

module.exports = ratingRouter;