import { NextFunction, Request, Response } from "express";
import AuthService from "../services/authService";
import RegisterRequest from "../models/auth/registerRequest";

export default class AuthController {
  _authService: AuthService = new AuthService();

  constructor() {}

  public registerController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const registerReq: RegisterRequest = req.body;
      const customToken = await this._authService.register(registerReq);

      res.send(customToken);
    } catch (e) {
      next(e);
    }
  };
}
