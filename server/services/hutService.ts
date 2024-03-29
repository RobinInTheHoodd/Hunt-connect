import { IHuntingParticipanModel } from "../models/HuntingPariticpantModel";
import hutDataAccess from "../repository/hutDataAccess";

class HutService {
  public async getHutParticipantsByHutId(
    hutID: number
  ): Promise<IHuntingParticipanModel[]> {
    try {
      const hutParticipants: IHuntingParticipanModel[] =
        await hutDataAccess.getParticipantsByHutID(hutID);
      hutParticipants.map((participant) => (participant.role = "Participant"));
      return hutParticipants;
    } catch (e: any) {
      throw e;
    }
  }
}

const hutService = new HutService();
export default hutService as HutService;
