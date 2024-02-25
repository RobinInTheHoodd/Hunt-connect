import { NextFunction, Request, Response } from "express";
import AuthService from "../services/authService";
import RegisterRequest from "../models/auth/registerRequest";
import { Auth } from "firebase-admin/auth";

class AuthController {
  constructor() {}

  public async registerController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const registerReq: RegisterRequest = req.body;
      const customToken = await AuthService.register(registerReq);

      res.send(customToken);
    } catch (e) {
      next(e);
    }
  }
}
const authController = new AuthController();
export default authController as AuthController;
