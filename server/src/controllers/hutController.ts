import { NextFunction, Request, Response } from "express";
import { IHuntingParticipanModel } from "../models/huntingParticipant/HuntingPariticpantModel";
import hutService from "../services/hutService";
import HutHunterModel from "../models/hutHunterModel";
class HutController {
  constructor() {}

  public async updateHunterDay(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { hutID } = req.params;
      const hunter: HutHunterModel = req.body;

      await hutService.updateHunterDay(parseInt(hutID), hunter);
      res.status(200).send();
    } catch (e: any) {
      next(e);
    }
  }

  public async deleteHutHunter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { hutID } = req.params;
      const hunterID: string = req.body.hunterID;
      await hutService.deleteHutHunter(parseInt(hutID), hunterID);
      res.status(200).send();
    } catch (e: any) {
      next(e);
    }
  }

  public async addHunter(req: Request, res: Response, next: NextFunction) {
    try {
      const { hutID } = req.params;
      const hunterEmail: string = req.body.hunterEmail;
      await hutService.addHunter(parseInt(hutID), hunterEmail);
      res.status(200).send();
    } catch (e: any) {
      next(e);
    }
  }
}

const hutController = new HutController();
export default hutController as HutController;
