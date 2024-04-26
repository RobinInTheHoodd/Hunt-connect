import { Request, Response, NextFunction } from "express";

export interface FirebaseError extends Error {
  code: string;
}

export const firebaseInitConnectErrorHandler = (
  err: FirebaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err || !err.code) return next(err);

  switch (err.code) {
    case "app/no-app":
    case "app/invalid-credential":
    case "app/invalid-configuration":
    case "failed-precondition":
    case "invalid-argument":
      res.status(500).json({ error: "A server configuration error occurred." });
      break;
    case "unavailable":
    case "resource-exhausted":
    case "network-error":
    case "timeout":
      res
        .status(503)
        .json({ error: "Temporary service issue. Please try again later." });
      break;
    case "auth/internal-error":
    case "auth/invalid-credential":
    case "auth/credential-not-found":
      res.status(401).json({
        error: "Authentication error. Please check your credentials.",
      });
      break;
    default:
      next(err);
      break;
  }
};
