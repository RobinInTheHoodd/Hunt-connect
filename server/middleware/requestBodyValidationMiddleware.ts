import { ValidationError } from "express-validator";
import e, { Request, Response, NextFunction } from "express";

const requestBodyValidationMiddleware = (
  err: ValidationError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.type == "field") {
    return res.status(400).json({
      message: err.msg,
      field: err.path,
    });
  }
  next(err);
};
export default requestBodyValidationMiddleware;
