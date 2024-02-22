import { Request, Response } from "express";
import authService from "../services/authService";
import RegisterRequest from "../models/auth/registerRequest";

const register = async (req: Request, res: Response) => {
  try {
    const registerReq: RegisterRequest = req.body;
    const customToken = await authService.register(registerReq);
    console.log(customToken);
    res.send(customToken);
  } catch (e) {}
};

export default {
  register,
};
