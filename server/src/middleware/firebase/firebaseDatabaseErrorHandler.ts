// middleware/firebaseDatabaseErrorHandler.ts
import { Request, Response, NextFunction } from "express";
import { FirebaseError } from "../../type/firebaseErrorTypes";

export const firebaseDatabaseErrorHandler = (
  err: FirebaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err || !err.code) return next(err);

  switch (err.code) {
    case "PERMISSION_DENIED":
      res.status(403).json({ error: "Access denied" });
      break;
    case "NETWORK_ERROR":
      res
        .status(503)
        .json({ error: "Network issues. Please try again later." });
      break;
    case "DISCONNECTED":
      res.status(503).json({ error: "Disconnected" });
      break;
    case "EXPIRED_TOKEN":
    case "INVALID_TOKEN":
      res
        .status(401)
        .json({ error: "Authentication failed due to an invalid token." });
      break;
    case "MAX_RETRIES_REACHED":
      res
        .status(429)
        .json({ error: "Max retries reached, please try again later." });
      break;
    case "UNAVAILABLE":
      res.status(503).json({ error: "service is unavailable." });
      break;
    case "UNKNOWN_ERROR":
      res.status(500).json({ error: "An unknown error occurred." });
      break;
    default:
      next(err);
  }
};
