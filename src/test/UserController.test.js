const httpMocks = require("node-mocks-http");
const {
  signUp,
  setPreferences,
  getPreferences,
  uploadUserImage,
} = require("../controllers/userController");
const { User } = require("../models/User");
const { Preference } = require("../models/Preferences");
// Mock the models
jest.mock("../models/User", () => ({
  User: {
    create: jest.fn(),
  },
}));
jest.mock("../models/Preferences", () => ({
  Preference: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe("User Controller", () => {
  describe("signUp", () => {
    it("should handle errors and return 500 status", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      User.create.mockRejectedValue(new Error("Failed to create user"));

      await signUp(req, res);

      expect(res.statusCode).toBe(500);
      // Ensure the error object structure matches the controller's output
      expect(res._getJSONData()).toEqual({
        error: "Failed to create user",
      });
    });
  });

  describe("setPreferences", () => {
    it("should handle errors and return 500 status", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      Preference.create.mockRejectedValue(
        new Error("Failed to create preferences")
      );

      await setPreferences(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        error: "Failed to create preferences",
      });
    });
  });

  describe("getPreferences", () => {
    it("should handle errors and return 500 status", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      Preference.findOne.mockRejectedValue(
        new Error("Failed to fetch preferences")
      );

      await getPreferences(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({
        error: "Failed to fetch preferences",
      });
    });
  });

  describe("uploadUserImage", () => {
    it("should handle errors and return 500 status", async () => {
      const req = httpMocks.createRequest({ method: "POST" });
      const res = httpMocks.createResponse();
      // Mimicking a scenario where no file is uploaded to trigger an error
      req.file = undefined;

      await uploadUserImage(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        success: false,
        message: "No image uploaded!",
      });
    });
  });
});
