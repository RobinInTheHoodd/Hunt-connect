import { NextFunction, Request, Response } from "express";
import AuthService from "../services/authService";
import IRegisterRequest from "../models/auth/RegisterRequest";
import { IHuntingSessionModel } from "../models/HuntingSessionModel";
import huntingSessionService from "../services/huntingSessionService";
import { validationResult } from "express-validator";

class HuntSessionController {
  constructor() {}

  public async addController(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = validationResult(req).array();

      if (validation.length != 0) {
        throw validation[0];
      }

      const huntSessionReq: IHuntingSessionModel = req.body;

      huntSessionReq.hutID = 1;
      await huntingSessionService.create(huntSessionReq);

      res.status(200);
    } catch (e) {
      next(e);
    }
  }

  public async getCurrent(req: Request, res: Response, next: NextFunction) {
    try {
      const { userID } = req.params;

      const huntSession = await huntingSessionService.getCurrentByUserId(
        userID
      );

      res.status(200).send(huntSession);
    } catch (e) {
      console.log(e);
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
      console.log(e);
      next(e);
    }
  }
}
const huntSessionController = new HuntSessionController();
export default huntSessionController as HuntSessionController;
