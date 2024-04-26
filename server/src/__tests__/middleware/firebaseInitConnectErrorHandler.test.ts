jest.mock("../../utils/helper", () => ({
  generateUniqueNumberID: jest.fn().mockImplementation(() => 12345),
}));

import { getMockReq, getMockRes } from "@jest-mock/express";
import { Request, Response, NextFunction } from "express";
import { FirebaseError } from "../../models/error/FirebaseError";
import huntingSessionService, {
  IHuntingSessionService,
} from "../../services/huntingSessionService";
import { firebaseAuthErrorHandler } from "../../middleware/firebase/firebaseAuthErrorHandler";
import { FirebaseAuthError } from "../../type/firebaseErrorTypes";
import { firebaseInitConnectErrorHandler } from "../../middleware/firebase/firebaseInitConnectErrorHandler";

describe("Firebase Connectivity Error Handler", () => {
  let _req: Request;
  let _res: Response;
  let _next: NextFunction;

  beforeEach(() => {
    _req = getMockReq({
      params: { hutID: "123" },
      body: { hunterName: "John Doe", location: "Forest", date: "2022-05-01" },
    });
    _res = getMockRes().res;
    _next = getMockRes().next;
    jest.clearAllMocks();
  });

  const configurationErrors = [
    "app/no-app",
    "app/invalid-credential",
    "app/invalid-configuration",
    "failed-precondition",
    "invalid-argument",
  ];
  configurationErrors.forEach((code) => {
    it(`should handle "${code}" error by sending 500 status`, () => {
      const error = { code } as FirebaseError;
      firebaseInitConnectErrorHandler(error, _req, _res, _next);
      expect(_res.status).toHaveBeenCalledWith(500);
      expect(_res.json).toHaveBeenCalledWith({
        error: "A server configuration error occurred.",
      });
    });
  });

  const serviceErrors = [
    "unavailable",
    "resource-exhausted",
    "network-error",
    "timeout",
  ];
  serviceErrors.forEach((code) => {
    it(`should handle "${code}" error by sending 503 status`, () => {
      const error = { code } as FirebaseError;
      firebaseInitConnectErrorHandler(error, _req, _res, _next);
      expect(_res.status).toHaveBeenCalledWith(503);
      expect(_res.json).toHaveBeenCalledWith({
        error: "Temporary service issue. Please try again later.",
      });
    });
  });

  const authErrors = [
    "auth/internal-error",
    "auth/invalid-credential",
    "auth/credential-not-found",
  ];
  authErrors.forEach((code) => {
    it(`should handle "${code}" error by sending 401 status`, () => {
      const error = { code } as FirebaseError;
      firebaseInitConnectErrorHandler(error, _req, _res, _next);
      expect(_res.status).toHaveBeenCalledWith(401);
      expect(_res.json).toHaveBeenCalledWith({
        error: "Authentication error. Please check your credentials.",
      });
    });
  });

  it("should pass other errors to next middleware", () => {
    const error = { code: "unknown-error" } as FirebaseError;
    firebaseInitConnectErrorHandler(error, _req, _res, _next);
    expect(_next).toHaveBeenCalledWith(error);
  });
});
