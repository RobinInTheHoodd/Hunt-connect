import { NextFunction, Request, Response } from "express";
import AuthService from "../services/authService";
import IRegisterRequest from "../models/auth/RegisterRequest";
import { IHuntingSessionModel } from "../models/huntingSession/HuntingSessionModel";
import huntingSessionService from "../services/huntingSessionService";
import { validationResult } from "express-validator";

class HuntSessionController {
  constructor() {}

  public async addController(req: Request, res: Response, next: NextFunction) {
    try {
      const huntSessionReq: IHuntingSessionModel = req.body;

      const huntSessionID = await huntingSessionService.create(huntSessionReq);

      res.status(200).send({ id: huntSessionID });
    } catch (e) {
      next(e);
    }
  }

  public async finishHuntingSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { huntID } = req.params;
      await huntingSessionService.finishSession(parseInt(huntID));
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }
}
const huntSessionController = new HuntSessionController();
export default huntSessionController as HuntSessionController;
