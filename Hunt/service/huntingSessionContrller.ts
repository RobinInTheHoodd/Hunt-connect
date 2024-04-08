import axios from "axios";
import { IHuntingSessionModel } from "../model/HuntingSession";

export const HuntingSessionController = {
  async saveHuntSession(huntSession: IHuntingSessionModel) {
    return await axios.post(
      "http://10.0.0.228:3000/hunt/session/add",
      huntSession
    );
  },

  async getCurrentHuntSession(userID: string) {
    return await axios.get(
      "http://10.0.0.228:3000/hunt/session/getCurrent/" + userID
    );
  },

  async getByID(huntingID: number) {
    return await axios.get(
      "http://10.0.0.228:3000/hunt/session/get/" + huntingID
    );
  },

  async finishHuntSession(huntSessionID: number) {
    console.log(typeof huntSessionID);
    return await axios.get(
      "http://10.0.0.228:3000/hunt/session/finish/" + huntSessionID
    );
  },

  async getHistoryHuntSession(userID: string) {
    return await axios.get(
      "http://10.0.0.228:3000/hunt/session/getHistory/" + userID
    );
  },
};
