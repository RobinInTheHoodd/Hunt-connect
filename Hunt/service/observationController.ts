import axios from "axios";
import ObservationModel from "../model/form/ObservationModel";

export const ObservationController = {
  async addObservation(observation: ObservationModel) {
    return await axios.post(
      "http://10.0.0.228:3000/hunt/session/" +
        observation.huntingSession +
        "/observation/create",
      observation
    );
  },

  async getObservations(huntingId: number) {
    return await axios.get(
      "http://10.0.0.228:3000/hunt/session/" +
        huntingId.toString() +
        "/observations"
    );
  },

  async updateObservations(updateObservation: ObservationModel) {
    return await axios.post(
      "http://10.0.0.228:3000/hunt/session/" +
        updateObservation.huntingSession +
        "/observation/update",
      updateObservation
    );
  },

  async deleteObservations(observationId: number, huntingId: number) {
    console.log(observationId);
    return await axios.post(
      "http://10.0.0.228:3000/hunt/session/" +
        huntingId +
        "/observation/delete",
      { id: observationId }
    );
  },
};
