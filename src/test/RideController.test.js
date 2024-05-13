const {
  createRide,
  searchForRides,
  fetchRidesByIds,
  fetchAllUnrequestedRides,
  getDriverRides,
  cancelRide,
} = require("../controllers/rideController");
const httpMocks = require("node-mocks-http");

const { RideRequest } = require("../models/RideRequest");
const { Ride } = require("../models/Ride");
const { Recurrence } = require("../models/Recurrence");
const { RideOccurence } = require("../models/RideOccurence");
const { isPointInPolygon } = require("geolib");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { Preference } = require("../models/Preferences");
// Mock each model separately
jest.mock("../models/RideRequest", () => ({
  RideRequest: { findAll: jest.fn() },
}));
jest.mock("../models/Ride", () => ({
  Ride: {
    create: jest.fn(),
    findAll: jest.fn(),
    belongsTo: jest.fn(), // Mock the belongsTo function used in your model associations
    update: jest.fn(),
  },
}));
jest.mock("../models/Preferences");

jest.mock("../models/RideOccurence", () => ({
  RideOccurence: {
    findAll: jest.fn(),
    create: jest.fn().mockResolvedValue({ id: 101 }),
    belongsToMany: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    set: jest.fn(() => ({ save: jest.fn() })),
    save: jest.fn(),
  },
}));

jest.mock("../models/User", () => ({
  User: {
    belongsToMany: jest.fn(),
  },
}));
jest.mock("geolib");

describe("Ride Controller", () => {
  describe("createRide", () => {
    it("should create a ride successfully and return 200", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/ride",
        body: {
          driverId: 1,
          from: "Point A",
          to: "Point B",
          recurrence: { type: "once" },
        },
      });
      const res = httpMocks.createResponse();

      Ride.create.mockResolvedValue({
        id: 1,
        ...req.body,
        initialDate: new Date(),
        Recurrence: req.body.recurrence,
      });

      await createRide(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        msg: "Successful Ride creation ",
      });
    });

    it("should handle errors and return 500 status", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/ride",
        body: { from: "Point A", to: "Point B" },
      });
      const res = httpMocks.createResponse();

      Ride.create.mockRejectedValue(new Error("Failed to create ride"));

      await createRide(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Failed to create ride",
      });
    });
  });

  describe("searchForRides", () => {
    it("should return matched rides", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/search-rides",
        query: {
          from: "Location A",
          to: "Location B",
          initialDate: "2021-01-01",
          fromTime: "10:00",
          toTime: "11:00",
          destinationOrOrigin: JSON.stringify({
            latitude: 34.0522,
            longitude: -118.2437,
          }),
          passengerId: 1,
        },
      });
      const res = httpMocks.createResponse();

      Ride.findAll.mockResolvedValue([
        {
          encodedArea: '[{"latitude": 34.0522, "longitude": -118.2437}]',
          Ride_occurences: [{ id: 101 }],
        },
      ]);
      isPointInPolygon.mockReturnValue(true);
      RideRequest.findAll.mockResolvedValue([]);

      await searchForRides(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData()).rides).toEqual([101]);
    });

    it("should handle errors and return 500 status", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/search-rides",
        query: { from: "Location A" },
      });
      const res = httpMocks.createResponse();

      Ride.findAll.mockRejectedValue(new Error("Database error"));

      await searchForRides(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({ error: "Database error" });
    });
  });
});

describe("Ride Controller", () => {
  // Example test case for fetchRidesByIds
  describe("fetchRidesByIds", () => {
    it("should fetch specific rides by IDs and return 200", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        query: { ids: "1,2,3" },
      });
      const res = httpMocks.createResponse();

      // Make sure to provide mock data
      RideOccurence.findAll.mockResolvedValue([
        {
          id: 1,
          occurenceDate: "2024-04-28",
          note: "Test Ride",
          Ride: { id: 201, name: "Test Ride to Work" },
        },
      ]);

      await fetchRidesByIds(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        rides: [
          {
            id: 1,
            occurenceDate: "2024-04-28",
            note: "Test Ride",
            Ride: { id: 201, name: "Test Ride to Work" },
          },
        ],
      });
    });
  });

  describe("fetchAllUnrequestedRides", () => {
    it("should fetch all unrequested rides for a passenger and return 200", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          passengerId: "passenger1",
          filterDate: "2024-04-28T12:00:00Z",
        },
      });
      const res = httpMocks.createResponse();

      // Mock data for RideOccurences
      RideOccurence.findAll.mockResolvedValue([
        {
          id: 101,
          occurenceDate: "2024-04-28",
          note: "Morning Ride",
          Ride: { id: 201, name: "Ride to Work" },
        },
        {
          id: 102,
          occurenceDate: "2024-04-28",
          note: "Evening Ride",
          Ride: { id: 202, name: "Ride Home" },
        },
      ]);

      // Mock data for RideRequests (simulating already requested rides)
      RideRequest.findAll.mockResolvedValue([{ RideOccurenceId: 101 }]);

      await fetchAllUnrequestedRides(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData()).rides).toEqual([
        {
          id: 102,
          occurenceDate: "2024-04-28",
          note: "Evening Ride",
          Ride: { id: 202, name: "Ride Home" },
        },
      ]);
    });
  });
});
describe("Ride Controller", () => {
  describe("cancelRide", () => {
    it("should cancel a single ride occurrence and return 200", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          rideOccId: 123,
          allInSeries: false,
        },
      });
      const res = httpMocks.createResponse();
      res.sendStatus = jest.fn().mockReturnValue(res); // Mock sendStatus to confirm it's called

      RideOccurence.findOne.mockResolvedValue({
        id: 123,
        RideId: 456,
        set: jest.fn(() => ({ save: jest.fn() })),
        save: jest.fn(),
      });

      await cancelRide(req, res);

      expect(RideOccurence.findOne).toHaveBeenCalledWith({
        where: { id: 123 },
        attributes: ["RideId", "id"],
      });
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should cancel all occurrences in a series and return 200", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          rideOccId: 123,
          allInSeries: true,
        },
      });
      const res = httpMocks.createResponse();
      res.sendStatus = jest.fn().mockReturnValue(res); // Mock sendStatus to confirm it's called

      RideOccurence.findOne.mockResolvedValue({
        id: 123,
        RideId: 456,
      });

      await cancelRide(req, res);

      expect(RideOccurence.update).toHaveBeenCalledWith(
        { status: -1 },
        { where: { RideId: 456 } }
      );
      expect(Ride.update).toHaveBeenCalledWith(
        { status: -1 },
        { where: { id: 456 } }
      );
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should handle errors and return 500 status", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          rideOccId: 123,
          allInSeries: false,
        },
      });
      const res = httpMocks.createResponse();
      res.status = jest.fn().mockReturnValue(res); // Mock status to confirm it's called
      res.json = jest.fn().mockReturnValue(res); // Mock json to confirm it's called

      RideOccurence.findOne.mockRejectedValue(new Error("Database error"));

      await cancelRide(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
