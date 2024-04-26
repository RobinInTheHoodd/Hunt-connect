import ObservationModel from "../model/form/ObservationModel";
import ObservationForm from "../model/observation/ObservationForm";

import { ObservationController } from "./observationController";

export default class ObservationService {
  async addObservation(observationForm: ObservationForm, userID: string) {
    try {
      const model = ObservationModel.fromForm(observationForm);
      model.specimenPosition.map((value) => {
        value.errorMessage = undefined;
        value.isValid = undefined;
      });

      model.hunterId = userID;

      const res = await ObservationController.addObservation(model);

      return model;
    } catch (e) {
      console.log(e);
    }
  }

  async getObservations(huntingId: number) {
    try {
      const res = await ObservationController.getObservations(huntingId);
      const observations: ObservationModel[] = res.data.map(
        (observation: ObservationModel) => {
          return ObservationModel.fromQuery(observation);
        }
      );
      return observations;
    } catch (e) {
      throw e;
    }
  }

  async updateObservations(observation: ObservationForm, userID: string) {
    try {
      const model = ObservationModel.fromForm(observation);
      model.hunterId = userID;
      await ObservationController.updateObservations(model);
      return model;
    } catch (e) {}
  }

  async deleteObservation(observationId: number, huntingId: number) {
    try {
      await ObservationController.deleteObservations(observationId, huntingId);
    } catch (e) {
      throw e;
      console.log(e);
    }
  }
}
