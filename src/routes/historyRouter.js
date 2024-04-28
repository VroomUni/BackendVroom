const historyRouter = require("express").Router();
const historyDriverRouter = require("express").Router();

const { getPassengerRideHistoryController, getDriverRideHistoryController } = require("../controllers/HistoryController");

historyRouter.get("/:firebaseId", getPassengerRideHistoryController);
historyDriverRouter.get("/:driverFirebaseId", getDriverRideHistoryController);

module.exports = { historyRouter, historyDriverRouter };