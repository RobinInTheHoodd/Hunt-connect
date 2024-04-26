jest.mock("../../services/huntingSessionService");
jest.mock("../../utils/helper", () => ({
  generateUniqueNumberID: jest.fn().mockImplementation(() => 12345),
}));

import { getMockReq, getMockRes } from "@jest-mock/express";
import { Request, Response, NextFunction } from "express";
import { FirebaseError } from "../../models/error/FirebaseError";
import hutService, { IHutService } from "../../services/hutService";
import huntingSessionService, {
  IHuntingSessionService,
} from "../../services/huntingSessionService";
import huntSessionController from "../../controllers/huntSessionController";

describe("Hunt Service", () => {
  let _mockHuntService: IHuntingSessionService;
  let _req: Request;
  let _res: Response;
  let _next: NextFunction;
  let _error: FirebaseError;

  beforeAll(() => {
    _mockHuntService = huntingSessionService;
  });

  beforeEach(() => {
    _req = getMockReq({
      params: { hutID: "123" },
      body: { hunterName: "John Doe", location: "Forest", date: "2022-05-01" },
    });
    _res = getMockRes().res;
    _next = getMockRes().next;
    _error = new FirebaseError("timeout", "error");
    jest.clearAllMocks();
  });

  describe("updateHunterDay", () => {
    it("should send a 200 status and return the session ID when a hunting session is successfully created", async () => {
      const expectedSessionID = "12345";
      (huntingSessionService.create as jest.Mock).mockResolvedValue(
        expectedSessionID
      );

      await huntSessionController.addController(_req, _res, _next);

      expect(huntingSessionService.create).toHaveBeenCalledWith(_req.body);
      expect(_res.status).toHaveBeenCalledWith(200);
      expect(_res.send).toHaveBeenCalledWith({ id: expectedSessionID });
      expect(_next).not.toHaveBeenCalled();
    });
    it("should handle errors by calling next with the error", async () => {
      (huntingSessionService.create as jest.Mock).mockRejectedValue(_error);

      await huntSessionController.addController(_req, _res, _next);

      expect(huntingSessionService.create).toHaveBeenCalledWith(_req.body);
      expect(_next).toHaveBeenCalledWith(_error);
    });
  });

  describe("finishHuntingSession", () => {
    it("should send a 200 status when a hunting session is successfully finished", async () => {
      (huntingSessionService.finishSession as jest.Mock).mockResolvedValue(
        null
      );

      await huntSessionController.finishHuntingSession(_req, _res, _next);

      expect(huntingSessionService.finishSession).toHaveBeenCalledWith(
        parseInt(_req.params.huntID)
      );
      expect(_res.status).toHaveBeenCalledWith(200);
      expect(_res.send).toHaveBeenCalled();
      expect(_next).not.toHaveBeenCalled();
    });
  });
  it("should handle errors by calling next with the error", async () => {
    huntingSessionService.finishSession = jest.fn().mockRejectedValue(_error);

    await huntSessionController.finishHuntingSession(_req, _res, _next);

    expect(huntingSessionService.finishSession).toHaveBeenCalledWith(
      parseInt(_req.params.huntID)
    );
    expect(_next).toHaveBeenCalledWith(_error);
  });
});
