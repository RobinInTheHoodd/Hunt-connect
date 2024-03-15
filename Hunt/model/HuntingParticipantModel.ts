import { IParticipantFormModel } from "./ParticipantFormModel";

export interface IHuntingParticipanModel {
  userID: string | undefined;
  displayName: string | undefined;
  role: string;
}

export default class HuntingParticipantModel
  implements IHuntingParticipanModel
{
  userID: string | undefined;
  displayName: string | undefined;
  role: string;

  constructor(
    display_name: string | undefined,
    role: string,
    userID?: string | undefined
  ) {
    this.userID = userID;
    this.displayName = display_name;
    this.role = role;
  }

  public static fromFormModel(participantForm: IParticipantFormModel) {
    let participants: IHuntingParticipanModel[] = [];
    participantForm.participants.forEach((participant) =>
      participants.push(
        new HuntingParticipantModel(
          participant.displayName,
          "Participant",
          participant.ID
        )
      )
    );
    let guets: IHuntingParticipanModel[] = [];
    participantForm.guest.forEach((guest) =>
      participants.push(
        new HuntingParticipantModel(guest.displayName, "guest", undefined)
      )
    );

    return participants;
  }
}
