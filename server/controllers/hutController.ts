import { NextFunction, Request, Response } from "express";
import { IHuntingParticipanModel } from "../models/HuntingPariticpantModel";
import hutService from "../services/hutService";
class HutController {
  constructor() {}

  public async getParticipantsByHutID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { hutID } = req.params;
      const participants: IHuntingParticipanModel[] =
        await hutService.getHutParticipantsByHutId(parseInt(hutID));
      res.status(200).send(participants);
    } catch (e: any) {
      next(e);
    }
  }
}

const hutController = new HutController();
export default hutController as HutController;
