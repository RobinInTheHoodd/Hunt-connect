jest.mock("../../controllers/huntSessionController");
import request from "supertest";
import app from "../../server";
import huntSessionController from "../../controllers/huntSessionController";

describe("Hunt Routes", () => {
  describe("POST /hunt/session/add", () => {
    it("should create a hunting session and return a success response", async () => {
      (huntSessionController.addController as jest.Mock).mockImplementation(
        (req, res, next) => {
          res.status(200).json({ id: "12345" });
        }
      );
      const sessionData = {
        hunterName: "John Doe",
        location: "Forest Zone 3",
        date: "2024-04-20",
      };

      const response = await request(app)
        .post("/hunt/session/add")
        .send(sessionData)
        .expect(200);

      expect(response.body).toHaveProperty("id");
    });
  });

  describe("GET /hunt/session/finish/:huntID", () => {
    it("should finish a hunting session and return a success message", async () => {
      (
        huntSessionController.finishHuntingSession as jest.Mock
      ).mockImplementation((req, res, next) => {
        res.status(200).json({ id: "12345" });
      });
      const huntID = "123456";

      await request(app).get(`/hunt/session/finish/${huntID}`).expect(200);
    });
  });
});
