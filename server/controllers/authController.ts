import { NextFunction, Request, Response } from "express";
import authService from "../services/authService";
import RegisterRequest from "../models/auth/registerRequest";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registerReq: RegisterRequest = req.body;
    const customToken = await authService.register(registerReq);

    res.send(customToken);
  } catch (e) {
    next(e);
  }
};

export default {
  register,
};
