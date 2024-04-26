import { NextFunction, Request, Response } from "express";
import ObservationModel, {
  IObservationModel,
} from "../models/observation/ObservationModel";
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
      const { huntID } = req.params;
      const observationReq: IObservationModel = req.body;
      await observationService.update(observationReq, parseInt(huntID));
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }

  public async deletePosition(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;
      const { huntID } = req.params;

      await observationService.deleteObservation(
        parseInt(id),
        parseInt(huntID)
      );
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  }
}
const observationController = new ObservationController();
export default observationController as ObservationController;
