const request = require("supertest");
const express = require("express");
const { requestRouter } = require("../routes/requestRouter"); // Adjust the path as necessary

// Mock the controllers used in the router
jest.mock("../controllers/requestController", () => ({
  createRequest: jest.fn((req, res) =>
    res.status(201).send({ message: "Request created" })
  ),
  handleRequestResponse: jest.fn((req, res) =>
    res.status(200).send({ message: "Response handled" })
  ),
}));

describe("Request Router", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", requestRouter);
  });

  describe("POST /", () => {
    it("should handle the creation of a request", async () => {
      const response = await request(app)
        .post("/")
        .send({ content: "Test request" });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ message: "Request created" });
      expect(
        require("../controllers/requestController").createRequest
      ).toHaveBeenCalled();
    });
  });

  describe("POST /response", () => {
    it("should handle responses to requests", async () => {
      const response = await request(app)
        .post("/response")
        .send({ response: "Test response" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: "Response handled" });
      expect(
        require("../controllers/requestController").handleRequestResponse
      ).toHaveBeenCalled();
    });
  });
});
