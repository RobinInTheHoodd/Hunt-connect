import HuntingParticipantModel, {
  IHuntingParticipanModel,
} from "../model/HuntingParticipantModel";
import { IParticipantModel } from "../model/ParticipantFormModel";
import { HutController } from "./hutController";

export default class HutService {
  async getHutParticipantsByHutID(hutId: number) {
    try {
      const res = await HutController.getParticipantsByHutId(hutId);
      if (res.data != undefined) {
        const participants: IHuntingParticipanModel[] =
          HuntingParticipantModel.fromParticipantModel(res.data);
        res.data;
        console.log(participants);
        return participants;
      }
      return [];
    } catch (e) {
      console.log(e);
    }
  }
}
