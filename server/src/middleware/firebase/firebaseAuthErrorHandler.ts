// middleware/firebaseAuthErrorHandler.ts
import { Request, Response, NextFunction } from "express";
import { FirebaseAuthError } from "../../type/firebaseErrorTypes";

import { FirebaseError } from "firebase-admin";

export const firebaseAuthErrorHandler = (
  err: FirebaseAuthError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err || !err.code) return next(err);

  switch (err.code) {
    case "auth/email-already-exists":
      res.status(409).json({
        error: "The email address is already in use.",
      });
      break;
    case "auth/invalid-email":
      res
        .status(400)
        .json({ error: "The email address is improperly formatted." });
      break;
    case "auth/operation-not-allowed":
      res.status(403).json({
        error: "The operation is not allowed.",
      });
      break;
    case "auth/too-many-requests":
      res.status(429).json({
        error:
          "We have blocked all requests from this device due to unusual activity. Try again later.",
      });
      break;
    case "USER_DISABLED":
      res.status(401).json({
        error: "The user account has been disabled.",
      });
      break;
    case "user-not-found":
      res.status(404).json({
        error: "The user account is not found.",
      });
    case "observation-not-found":
      res.status(404).json({
        error: "The observation is not found.",
      });

      break;
    default:
      next(err);
  }
};
