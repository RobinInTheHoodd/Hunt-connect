import firebaseConfig from "../config/firebaseConfig";
import { Request, Response, NextFunction } from "express";

const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (/^\/auth/.test(req.path)) {
    return next();
  }

  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    firebaseConfig.firebaseAuth.verifyIdToken(bearerToken);
    next();
  } else {
    res.sendStatus(401);
  }
};

export default verifyTokenMiddleware;
