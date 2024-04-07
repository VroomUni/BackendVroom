const { createRequest } = require("../controllers/requestController");

const requestRouter = require("express").Router();

requestRouter.post("/", createRequest);

module.exports = { requestRouter };
