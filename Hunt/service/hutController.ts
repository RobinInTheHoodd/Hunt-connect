import axios from "axios";
import { IHutHunterModel } from "../model/HutHunterModel";

export const HutController = {
  async getParticipantsByHutId(hutID: number) {
    return await axios.get(
      "http://10.0.0.228:3000/hut/" + hutID + "/participants"
    );
  },

  async updateHunterDay(hutID: number, hunter: IHutHunterModel) {
    return await axios.post(
      "http://10.0.0.228:3000/hut/" + hutID + "/updateHunterDay",
      hunter
    );
  },

  async deleteHutHunter(hutID: number, hunterID: string) {
    return await axios.post(
      "http://10.0.0.228:3000/hut/" + hutID + "/deleteHutHunter",
      { hunterID: hunterID }
    );
  },

  async addHunterByEmail(hunterEmail: string, hutID: number) {
    return await axios.post(
      "http://10.0.0.228:3000/hut/" + hutID + "/addHunter",
      { hunterEmail: hunterEmail }
    );
  },
};
