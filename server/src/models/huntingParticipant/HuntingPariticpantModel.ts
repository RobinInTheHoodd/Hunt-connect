export interface IHuntingParticipanModel {
  userID?: string;
  displayName?: string;
  role: string;
}

export default class HuntingParticipantModel
  implements IHuntingParticipanModel
{
  userID?: string;
  displayName?: string;
  role: string;

  constructor(display_name: string, role: string, userID?: string) {
    this.displayName = display_name;
    this.role = role;
    this.userID = userID;
  }

  public static fromQuery(participant: any) {
    const role = participant.participant_id ? "Participant" : "Invité";
    return new HuntingParticipantModel(
      participant.display_name,
      role,
      participant.participant_id
    );
  }
}
