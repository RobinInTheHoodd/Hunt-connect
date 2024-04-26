jest.mock("../../controllers/hutController");
import request from "supertest";
import app from "../../server";
import hutController from "../../controllers/hutController";

describe("Hut Routes", () => {
  describe("POST /:hutID/addHunter", () => {
    it("should handle adding a hunter", async () => {
      (hutController.addHunter as jest.Mock).mockImplementation(
        (req, res, next) => {
          res.status(201).json({ id: "12345" });
        }
      );

      const response = await request(app)
        .post("/hut/123/addHunter")
        .send({ hunterEmail: "hunter@example.com" })
        .expect(201);

      expect(hutController.addHunter).toHaveBeenCalled();
    });
  });

  describe("POST /:hutID/updateHunterDay", () => {
    it("should handle updating a hunter day", async () => {
      (hutController.updateHunterDay as jest.Mock).mockImplementation(
        (req, res, next) => {
          res.status(200).json({ id: "12345" });
        }
      );
      const response = await request(app)
        .post("/hut/123/updateHunterDay")
        .send({ date: "2024-04-23" })
        .expect(200);

      expect(hutController.updateHunterDay).toHaveBeenCalled();
    });
  });

  describe("POST /:hutID/deleteHutHunter", () => {
    it("should handle deleting a hunter", async () => {
      (hutController.deleteHutHunter as jest.Mock).mockImplementation(
        (req, res, next) => {
          res.status(204).json({ id: "12345" });
        }
      );
      const response = await request(app)
        .post("/hut/123/deleteHutHunter")
        .send({ hunterId: "hunter123" })
        .expect(204);

      expect(hutController.deleteHutHunter).toHaveBeenCalled();
    });
  });
});
