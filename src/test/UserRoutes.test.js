const request = require("supertest");
const express = require("express");
const { userRouter } = require("../routes/userRouter"); // Adjust the path as necessary

// Mock the controllers
jest.mock("../controllers/userController", () => ({
  signUp: jest.fn((req, res) =>
    res.status(201).send({ message: "User signed up" })
  ),
  setPreferences: jest.fn((req, res) =>
    res.status(200).send({ message: "Preferences set" })
  ),
  getPreferences: jest.fn((req, res) =>
    res.status(200).send({ preferences: {} })
  ),
  uploadUserImage: jest.fn((req, res) =>
    res.status(200).send({ message: "Image uploaded", path: req.file.path })
  ),
}));

// Mock the multer middleware for file uploads
jest.mock("../middlewares/multer", () => {
  return {
    single: () => (req, res, next) => {
      req.file = { path: "fakepath/image.jpg" }; // Mock the file path
      next();
    },
  };
});

describe("User Router", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/user", userRouter); // Prefix all routes with '/user' for testing
  });

  describe("POST /user/signup", () => {
    it("should sign up a new user", async () => {
      const response = await request(app).post("/user/signup").send({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ message: "User signed up" });
    });
  });

  describe("POST /user/preferences", () => {
    it("should set user preferences", async () => {
      const response = await request(app)
        .post("/user/preferences")
        .send({ smoking: false, pets: false });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: "Preferences set" });
    });
  });

  describe("GET /user/preferences", () => {
    it("should get user preferences", async () => {
      const response = await request(app)
        .get("/user/preferences")
        .query({ userId: "123" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ preferences: {} });
    });
  });

  describe("POST /user/upload-image", () => {
    it("should upload an image", async () => {
      const response = await request(app)
        .post("/user/upload-image")
        .attach("image", Buffer.from("fake image data"), "test.jpg");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: "Image uploaded",
        path: "fakepath/image.jpg",
      });
    });
  });
});
