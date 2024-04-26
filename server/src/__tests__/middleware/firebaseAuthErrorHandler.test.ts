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

describe("Firebase Auth Error Handler", () => {
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

  it('should handle "auth/email-already-exists" error by sending 409 status', () => {
    const error = { code: "auth/email-already-exists" } as FirebaseAuthError;
    firebaseAuthErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(409);
    expect(_res.json).toHaveBeenCalledWith({
      error: "The email address is already in use.",
    });
  });

  it('should handle "auth/invalid-email" error by sending 400 status', () => {
    const error = { code: "auth/invalid-email" } as FirebaseAuthError;
    firebaseAuthErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(400);
    expect(_res.json).toHaveBeenCalledWith({
      error: "The email address is improperly formatted.",
    });
  });

  it('should handle "auth/operation-not-allowed" error by sending 403 status', () => {
    const error = { code: "auth/operation-not-allowed" } as FirebaseAuthError;
    firebaseAuthErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(403);
    expect(_res.json).toHaveBeenCalledWith({
      error: "The operation is not allowed.",
    });
  });

  it('should handle "auth/too-many-requests" error by sending 429 status', () => {
    const error = { code: "auth/too-many-requests" } as FirebaseAuthError;
    firebaseAuthErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(429);
    expect(_res.json).toHaveBeenCalledWith({
      error:
        "We have blocked all requests from this device due to unusual activity. Try again later.",
    });
  });

  it('should handle "USER_DISABLED" error by sending 401 status', () => {
    const error = { code: "USER_DISABLED" } as FirebaseAuthError;
    firebaseAuthErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(401);
    expect(_res.json).toHaveBeenCalledWith({
      error: "The user account has been disabled.",
    });
  });

  it('should handle "user-not-found" error by sending 404 status', () => {
    const error = { code: "user-not-found" } as FirebaseAuthError;
    firebaseAuthErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(404);
    expect(_res.json).toHaveBeenCalledWith({
      error: "The user account is not found.",
    });
  });

  it('should handle "observation-not-found" error by sending 404 status', () => {
    const error = { code: "observation-not-found" } as FirebaseAuthError;
    firebaseAuthErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(404);
    expect(_res.json).toHaveBeenCalledWith({
      error: "The observation is not found.",
    });
  });

  it("should pass other errors to next middleware", () => {
    const error = { code: "unknown-error" } as FirebaseAuthError;
    firebaseAuthErrorHandler(error, _req, _res, _next);
    expect(_next).toHaveBeenCalledWith(error);
  });
});
