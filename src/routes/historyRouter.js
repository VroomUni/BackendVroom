// historyRouter.js
const historyRouter = require("express").Router();
const { getPassengerRideHistoryController } = require("../controllers/HistoryController");

historyRouter.get("/history/:firebaseId", getPassengerRideHistoryController);

module.exports = { historyRouter };
