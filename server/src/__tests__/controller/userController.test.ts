jest.mock("../../services/authService");
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
import authService, { IAuthService } from "../../services/authService";
import authController from "../../controllers/authController";

describe("User Controller", () => {
  let _mockAuthService: IAuthService;
  let _req: Request;
  let _res: Response;
  let _next: NextFunction;
  let _error: FirebaseError;

  beforeAll(() => {
    _mockAuthService = authService;
  });

  beforeEach(() => {
    _req = getMockReq({
      body: { details: "Example observation" },
      params: { huntID: "12345" },
    });
    _res = getMockRes().res;
    _next = getMockRes().next;
    _error = new FirebaseError("timeout", "error");
    jest.clearAllMocks();
  });

  describe("registerController", () => {
    it("should send a 200 status and a custom token when registration is successful", async () => {
      const expectedToken = "customToken123";
      (_mockAuthService.register as jest.Mock).mockResolvedValue(expectedToken);

      await authController.registerController(_req, _res, _next);

      expect(_mockAuthService.register).toHaveBeenCalledWith(_req.body);
      expect(_res.status).toHaveBeenCalledWith(200);
      expect(_res.send).toHaveBeenCalledWith(expectedToken);
      expect(_next).not.toHaveBeenCalled();
    });

    it("should handle errors by logging and calling next with the error", async () => {
      (_mockAuthService.register as jest.Mock).mockRejectedValue(_error);

      await authController.registerController(_req, _res, _next);

      expect(authService.register).toHaveBeenCalledWith(_req.body);
      expect(_next).toHaveBeenCalledWith(_error);
    });
  });
});
