const {
  createRequest,
  handleRequestResponse,
} = require("../controllers/requestController");

const requestRouter = require("express").Router();

requestRouter.post("/", createRequest);
requestRouter.post("/response", handleRequestResponse);

module.exports = { requestRouter };
