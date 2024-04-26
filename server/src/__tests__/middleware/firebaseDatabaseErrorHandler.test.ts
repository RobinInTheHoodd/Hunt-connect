jest.mock("../../utils/helper", () => ({
  generateUniqueNumberID: jest.fn().mockImplementation(() => 12345),
}));

import { getMockReq, getMockRes } from "@jest-mock/express";

import { FirebaseError } from "../../models/error/FirebaseError";
import { Request, Response, NextFunction } from "express";
import { firebaseDatabaseErrorHandler } from "../../middleware/firebase/firebaseDatabaseErrorHandler";

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

  it('should handle "PERMISSION_DENIED" error by sending 403 status', () => {
    const error = { code: "PERMISSION_DENIED" } as FirebaseError;
    firebaseDatabaseErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(403);
    expect(_res.json).toHaveBeenCalledWith({ error: "Access denied" });
  });

  it('should handle "NETWORK_ERROR" error by sending 503 status', () => {
    const error = { code: "NETWORK_ERROR" } as FirebaseError;
    firebaseDatabaseErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(503);
    expect(_res.json).toHaveBeenCalledWith({
      error: "Network issues. Please try again later.",
    });
  });

  it('should handle "DISCONNECTED" error by sending 503 status', () => {
    const error = { code: "DISCONNECTED" } as FirebaseError;
    firebaseDatabaseErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(503);
    expect(_res.json).toHaveBeenCalledWith({ error: "Disconnected" });
  });

  it("should handle token related errors by sending 401 status", () => {
    const errors = [{ code: "EXPIRED_TOKEN" }, { code: "INVALID_TOKEN" }];
    errors.forEach((err) => {
      firebaseDatabaseErrorHandler(err as FirebaseError, _req, _res, _next);
      expect(_res.status).toHaveBeenCalledWith(401);
      expect(_res.json).toHaveBeenCalledWith({
        error: "Authentication failed due to an invalid token.",
      });
    });
  });

  it('should handle "MAX_RETRIES_REACHED" error by sending 429 status', () => {
    const error = { code: "MAX_RETRIES_REACHED" } as FirebaseError;
    firebaseDatabaseErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(429);
    expect(_res.json).toHaveBeenCalledWith({
      error: "Max retries reached, please try again later.",
    });
  });

  it('should handle "UNAVAILABLE" error by sending 503 status', () => {
    const error = { code: "UNAVAILABLE" } as FirebaseError;
    firebaseDatabaseErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(503);
    expect(_res.json).toHaveBeenCalledWith({
      error: "service is unavailable.",
    });
  });

  it('should handle "UNKNOWN_ERROR" error by sending 500 status', () => {
    const error = { code: "UNKNOWN_ERROR" } as FirebaseError;
    firebaseDatabaseErrorHandler(error, _req, _res, _next);
    expect(_res.status).toHaveBeenCalledWith(500);
    expect(_res.json).toHaveBeenCalledWith({
      error: "An unknown error occurred.",
    });
  });

  it("should pass other errors to next middleware", () => {
    const error = { code: "OTHER_ERROR" } as FirebaseError;
    firebaseDatabaseErrorHandler(error, _req, _res, _next);
    expect(_next).toHaveBeenCalledWith(error);
  });
});
