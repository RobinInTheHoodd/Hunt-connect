import axios from "axios";

export const HutController = {
  async getParticipantsByHutId(hutID: number) {
    return await axios.get(
      "http://10.0.0.228:3000/hut/" + hutID + "/participants"
    );
  },
};
