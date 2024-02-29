import { NextFunction, Request, Response } from "express";
import AuthService from "../services/authService";
import IRegisterRequest from "../models/auth/RegisterRequest";
import { Auth } from "firebase-admin/auth";

class AuthController {
  constructor() {}

  public async registerController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const registerReq: IRegisterRequest = req.body;
      const customToken = await AuthService.register(registerReq);

      res.status(200).send(customToken);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}
const authController = new AuthController();
export default authController as AuthController;
