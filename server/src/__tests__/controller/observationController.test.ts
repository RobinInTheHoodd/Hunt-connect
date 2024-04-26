jest.mock("../../services/observationService");
jest.mock("../../utils/helper", () => ({
  generateUniqueNumberID: jest.fn().mockImplementation(() => 12345),
}));

import { getMockReq, getMockRes } from "@jest-mock/express";
import { Request, Response, NextFunction } from "express";
import observationService, {
  IObservationService,
} from "../../services/observationService";
import observationController from "../../controllers/observationController";
import { FirebaseError } from "../../models/error/FirebaseError";
import { error } from "console";

describe("Observation controller", () => {
  let _mockObservationService: IObservationService;
  let _req: Request;
  let _res: Response;
  let _next: NextFunction;
  let _error: FirebaseError;

  beforeAll(() => {
    _mockObservationService = observationService;
  });

  beforeEach(() => {
    _req = getMockReq({
      body: { details: "Example observation", id: "101" },
      params: { huntID: "12345" },
    });
    _res = getMockRes().res;
    _next = getMockRes().next;
    _error = new FirebaseError("timeout", "error");
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should send a 200 status when an observation is successfully created", async () => {
      (observationService.create as jest.Mock).mockResolvedValue(null);
      await observationController.create(_req, _res, _next);

      expect(observationService.create).toHaveBeenCalledWith(_req.body);
      expect(_res.status).toHaveBeenCalledWith(200);
      expect(_res.send).toHaveBeenCalled();
      expect(_next).not.toHaveBeenCalled();
    });

    it("should handle errors by calling next with the error", async () => {
      (observationService.create as jest.Mock).mockRejectedValue(_error);

      await observationController.create(_req, _res, _next);

      expect(observationService.create).toHaveBeenCalledWith(_req.body);
      expect(_next).toHaveBeenCalledWith(_error);
    });
  });

  describe("update", () => {
    it("should send a 200 status when an observation is successfully updated", async () => {
      (observationService.update as jest.Mock).mockResolvedValue(null);

      await observationController.update(_req, _res, _next);

      expect(observationService.update).toHaveBeenCalledWith(
        _req.body,
        parseInt(_req.params.huntID)
      );
      expect(_res.status).toHaveBeenCalledWith(200);
      expect(_res.send).toHaveBeenCalled();
      expect(_next).not.toHaveBeenCalled();
    });

    it("should handle errors by calling next with the error", async () => {
      (observationService.update as jest.Mock).mockRejectedValue(_error);

      await observationController.update(_req, _res, _next);

      expect(observationService.update).toHaveBeenCalledWith(
        _req.body,
        parseInt(_req.params.huntID)
      );
      expect(_next).toHaveBeenCalledWith(_error);
    });
  });

  describe("deletePosition", () => {
    it("should send a 200 status when a position is successfully deleted", async () => {
      (observationService.deleteObservation as jest.Mock).mockResolvedValue(
        null
      );

      await observationController.deletePosition(_req, _res, _next);

      expect(observationService.deleteObservation).toHaveBeenCalledWith(
        parseInt(_req.body.id),
        parseInt(_req.params.huntID)
      );
      expect(_res.status).toHaveBeenCalledWith(200);
      expect(_res.send).toHaveBeenCalled();
      expect(_next).not.toHaveBeenCalled();
    });

    it("should handle errors by calling next with the error", async () => {
      (observationService.deleteObservation as jest.Mock).mockRejectedValue(
        _error
      );

      await observationController.deletePosition(_req, _res, _next);

      expect(observationService.deleteObservation).toHaveBeenCalledWith(
        parseInt(_req.body.id),
        parseInt(_req.params.huntID)
      );
      expect(_next).toHaveBeenCalledWith(_error);
    });
  });
});
