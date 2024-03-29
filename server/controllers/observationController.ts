import { NextFunction, Request, Response } from "express";
import ObservationModel, {
  IObservationModel,
} from "../models/ObservationModel";
import observationService from "../services/observationService";

class ObservationController {
  constructor() {}

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const observationReq: IObservationModel = req.body;
      await observationService.create(observationReq);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const observationReq: IObservationModel = req.body;
      await observationService.update(observationReq);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }

  public async deletePosition(req: Request, res: Response, next: NextFunction) {
    try {
      let { id } = req.body;
      id = parseInt(id);
      await observationService.deleteObservation(id);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }

  public async getObservations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { huntID } = req.params;
      const observations: ObservationModel[] =
        await observationService.getObservations(parseInt(huntID));
      res.status(200).send(observations);
    } catch (e) {
      next(e);
    }
  }
}
const observationController = new ObservationController();
export default observationController as ObservationController;
