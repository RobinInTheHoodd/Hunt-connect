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
      const validation = validationResult(req).array();

      if (validation.length != 0) {
        throw validation[0];
      }

      const huntSessionReq: IHuntingSessionModel = req.body;

      huntSessionReq.hutID = 1;
      const huntSessionID = await huntingSessionService.create(huntSessionReq);

      res.status(200).send({ id: huntSessionID });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  public async getCurrent(req: Request, res: Response, next: NextFunction) {
    try {
      const { userID } = req.params;
      const huntSession = await huntingSessionService.getCurrentByUserId(
        userID
      );
      console.log(JSON.stringify(huntSession, null, 2));
      res.status(200).send(huntSession);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { huntingID } = req.params;
      const huntSession = await huntingSessionService.getById(
        parseInt(huntingID)
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

  public async getHistoryByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userID } = req.params;
      const historySession =
        await huntingSessionService.getHistoryDateHuntingSession(userID);
      res.status(200).send(historySession);
    } catch (e) {
      next(e);
    }
  }
}
const huntSessionController = new HuntSessionController();
export default huntSessionController as HuntSessionController;
