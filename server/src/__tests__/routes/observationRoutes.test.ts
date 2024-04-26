jest.mock("../../controllers/observationController");
import request from "supertest";
import app from "../../server";
import observationController from "../../controllers/observationController";

describe("Observation Routes", () => {
  const _huntID = "12345";

  describe("POST /observation/create", () => {
    it("should create an observation and return the created observation details", async () => {
      const observationData = {
        species: "Eagle",
        location: "North Ridge",
        date: "2024-04-23",
      };

      (observationController.create as jest.Mock).mockImplementationOnce(
        (req, res, next) => {
          res.status(200).json({ species: observationData.species });
        }
      );

      const response = await request(app)
        .post(`/hunt/session/${_huntID}/observation/create`)
        .send(observationData)
        .expect(200);

      expect(response.body.species).toEqual(observationData.species);
    });
  });

  describe("POST /observation/update", () => {
    it("should update an observation and return a success message", async () => {
      const updateData = {
        id: "123",
        species: "Eagle Updated",
      };

      (observationController.update as jest.Mock).mockImplementationOnce(
        (req, res, next) => {
          res.status(200).json({ message: "Observation updated successfully" });
        }
      );

      const response = await request(app)
        .post(`/hunt/session/${_huntID}/observation/update`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toEqual("Observation updated successfully");
    });
  });

  describe("POST /observation/delete", () => {
    it("should delete an observation and return a success message", async () => {
      const deleteData = {
        id: "123",
      };

      (observationController.deletePosition as jest.Mock).mockImplementation(
        (req, res, next) => {
          res.status(200).json({ message: "Observation deleted successfully" });
        }
      );

      const response = await request(app)
        .post(`/hunt/session/${_huntID}/observation/delete`)
        .send(deleteData)
        .expect(200);

      expect(response.body.message).toEqual("Observation deleted successfully");
    });
  });
});
