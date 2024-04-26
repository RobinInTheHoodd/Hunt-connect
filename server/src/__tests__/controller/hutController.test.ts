jest.mock("../../services/hutService");
jest.mock("../../utils/helper", () => ({
  generateUniqueNumberID: jest.fn().mockImplementation(() => 12345),
}));

import { getMockReq, getMockRes } from "@jest-mock/express";
import { Request, Response, NextFunction } from "express";
import { FirebaseError } from "../../models/error/FirebaseError";
import authService, { IAuthService } from "../../services/authService";
import hutService, { IHutService } from "../../services/hutService";
import hutController from "../../controllers/hutController";

describe("Hut Service", () => {
  let _mockHutService: IHutService;
  let _req: Request;
  let _res: Response;
  let _next: NextFunction;
  let _error: FirebaseError;

  beforeAll(() => {
    _mockHutService = hutService;
  });

  beforeEach(() => {
    _req = getMockReq({
      params: { hutID: "123" },
      body: {
        name: "John Doe",
        day: "2021-12-01",
        hunterID: "456",
        hunterEmail: "hunter@example.com",
      },
    });
    _res = getMockRes().res;
    _next = getMockRes().next;
    _error = new FirebaseError("timeout", "error");
    jest.clearAllMocks();
  });

  describe("updateHunterDay", () => {
    it("should send a 200 status when hunter day is successfully updated", async () => {
      (hutService.updateHunterDay as jest.Mock).mockResolvedValue(null);

      await hutController.updateHunterDay(_req, _res, _next);

      expect(hutService.updateHunterDay).toHaveBeenCalledWith(
        parseInt(_req.params.hutID),
        _req.body
      );
      expect(_res.status).toHaveBeenCalledWith(200);
      expect(_res.send).toHaveBeenCalled();
      expect(_next).not.toHaveBeenCalled();
    });

    it("should handle errors by calling next with the error", async () => {
      hutService.updateHunterDay = jest.fn().mockRejectedValue(_error);

      await hutController.updateHunterDay(_req, _res, _next);

      expect(hutService.updateHunterDay).toHaveBeenCalledWith(
        parseInt(_req.params.hutID),
        _req.body
      );
      expect(_next).toHaveBeenCalledWith(_error);
    });
  });

  describe("deleteHunter", () => {
    it("should send a 200 status when a hut hunter is successfully deleted", async () => {
      (_mockHutService.deleteHutHunter as jest.Mock).mockResolvedValue(null);

      await hutController.deleteHutHunter(_req, _res, _next);

      expect(hutService.deleteHutHunter).toHaveBeenCalledWith(
        parseInt(_req.params.hutID),
        _req.body.hunterID
      );
      expect(_res.status).toHaveBeenCalledWith(200);
      expect(_res.send).toHaveBeenCalled();
      expect(_next).not.toHaveBeenCalled();
    });

    it("should handle errors by calling next with the error", async () => {
      hutService.deleteHutHunter = jest.fn().mockRejectedValue(_error);

      await hutController.deleteHutHunter(_req, _res, _next);

      expect(hutService.deleteHutHunter).toHaveBeenCalledWith(
        parseInt(_req.params.hutID),
        _req.body.hunterID
      );
      expect(_next).toHaveBeenCalledWith(_error);
    });
  });

  describe("addHunter", () => {
    it("should send a 200 status when a hunter is successfully added", async () => {
      (hutService.addHunter as jest.Mock).mockResolvedValue(null);

      await hutController.addHunter(_req, _res, _next);

      expect(hutService.addHunter).toHaveBeenCalledWith(
        parseInt(_req.params.hutID),
        _req.body.hunterEmail
      );
      expect(_res.status).toHaveBeenCalledWith(200);
      expect(_res.send).toHaveBeenCalled();
      expect(_next).not.toHaveBeenCalled();
    });

    it("should handle errors by calling next with the error", async () => {
      (hutService.addHunter as jest.Mock).mockRejectedValue(_error);

      await hutController.addHunter(_req, _res, _next);

      expect(hutService.addHunter).toHaveBeenCalledWith(
        parseInt(_req.params.hutID),
        _req.body.hunterEmail
      );

      expect(_next).toHaveBeenCalledWith(_error);
    });
  });
});
