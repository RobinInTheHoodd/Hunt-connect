jest.mock("../../controllers/authController");
import request from "supertest";
import app from "../../server";
import authController from "../../controllers/authController";

describe("User Routes", () => {
  describe("POST /register", () => {
    it("should register a user and return the user ID", async () => {
      (authController.registerController as jest.Mock).mockImplementation(
        (req, res, next) => {
          res.status(200).json({ id: "12345" });
        }
      );
      const userData = {
        username: "newuser",
        password: "password123",
        email: "user@example.com",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(200);

      expect(response.body).toHaveProperty("id");
    });

    it("should handle validation errors for missing fields", async () => {
      (authController.registerController as jest.Mock).mockImplementation(
        (req, res, next) => {
          res.status(400).json({ error: "not-found" });
        }
      );
      const userData = {
        username: "newuser",
      };

      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });
});
