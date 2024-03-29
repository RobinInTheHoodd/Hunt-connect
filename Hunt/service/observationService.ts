import ObservationModel from "../model/form/ObservationModel";
import ObservationForm from "../model/observation/ObservationForm";
import ObservationFormDuckPosition from "../model/observation/ObservationFormDuckPosition";
import { ObservationController } from "./observationController";

export default class ObservationService {
  async addObservation(observationForm: ObservationForm, userID: string) {
    try {
      const model = ObservationModel.fromForm(observationForm);
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
      console.log(e);
    }
  }

  async updateObservations(observation: ObservationForm, userID: string) {
    try {
      const model = ObservationModel.fromForm(observation);
      model.hunterId = userID;
      await ObservationController.updateObservations(model);
      return model;
    } catch (e) {
      console.log(e);
    }
  }

  async deleteObservation(observationId: number, huntingId: number) {
    try {
      await ObservationController.deleteObservations(observationId, huntingId);
    } catch (e) {
      console.log(e);
    }
  }
}
