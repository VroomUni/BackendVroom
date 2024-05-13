const { createRequest } = require("../controllers/requestController");
const { RideRequest } = require("../models/RideRequest");
const httpMocks = require("node-mocks-http");

jest.mock("../models/RideRequest");

describe("createRequest Controller", () => {
  it("should create a ride request and return 200 status", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/ride-request",
      body: {
        passengerLocation: { latitude: 34.0522, longitude: -118.2437 },
      },
    });
    const res = httpMocks.createResponse();

    RideRequest.create.mockResolvedValue({ id: 1, ...req.body });

    await createRequest(req, res);
    expect(res.statusCode).toBe(200);
    // Parse the response data if it's a string
    expect(JSON.parse(res._getData())).toEqual({});
  });

  it("should handle errors and return 500 status", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        passengerLocation: { latitude: 34.0522, longitude: -118.2437 },
      },
    });
    const res = httpMocks.createResponse();

    RideRequest.create.mockRejectedValue(new Error("Database error"));

    await createRequest(req, res);
    expect(res.statusCode).toBe(500);
    // Check for error message instead of error object
    expect(JSON.parse(res._getData()).error).toEqual("Database error");
  });
});
