const request = require("supertest");
const express = require("express");
const { rideRouter } = require("../routes/rideRouter"); // Adjust the path as necessary

// Mock the controllers and middleware
jest.mock("../controllers/rideController", () => ({
  createRide: jest.fn((req, res) =>
    res.status(201).send({ message: "Ride created" })
  ),
  searchForRides: jest.fn((req, res) => res.status(200).send({ rides: [] })),
  fetchRidesByIds: jest.fn((req, res) => res.status(200).send({ rides: [] })),
  fetchAllUnrequestedRides: jest.fn((req, res) =>
    res.status(200).send({ rides: [] })
  ),
  getRidesByDriverId: jest.fn((req, res) =>
    res.status(200).send({ rides: [] })
  ),
  cancelRide: jest.fn((req, res) =>
    res.status(200).send({ message: "Ride cancelled" })
  ),
}));
jest.mock("../middlewares/isAuth", () => jest.fn((req, res, next) => next()));

describe("Ride Router", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/rides", rideRouter); // Prefix all routes with '/rides' for testing
  });

  describe("POST /rides/", () => {
    it("should create a ride", async () => {
      const response = await request(app)
        .post("/rides/")
        .send({ driverId: 1, route: "route details" });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ message: "Ride created" });
    });
  });

  describe("PUT /rides/", () => {
    it("should cancel a ride", async () => {
      const response = await request(app).put("/rides/").send({ rideId: 1 });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: "Ride cancelled" });
    });
  });

  describe("POST /rides/all", () => {
    it("should fetch all unrequested rides", async () => {
      const response = await request(app).post("/rides/all");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ rides: [] });
    });
  });

  describe("GET /rides/", () => {
    it("should search for rides", async () => {
      const response = await request(app)
        .get("/rides/")
        .query({ startLocation: "A", endLocation: "B" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ rides: [] });
    });
  });

  describe("GET /rides/driver", () => {
    it("should get rides by driver ID", async () => {
      const response = await request(app)
        .get("/rides/driver")
        .query({ driverId: 1 });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ rides: [] });
    });
  });

  describe("GET /rides/byIds", () => {
    it("should fetch rides by IDs", async () => {
      const response = await request(app)
        .get("/rides/byIds")
        .query({ ids: "1,2,3" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ rides: [] });
    });
  });
});
