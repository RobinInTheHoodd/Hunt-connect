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

  public static validateBody() {
    return {
      "participants.*.userID": {
        custom: {
          options: (value: any) => {
            if (value == undefined || value == null) return true;
            else {
              if (typeof value !== "string")
                throw new Error(
                  "L'identifiant du participant est une chaine de charactère"
                );
              if (value.length <= 0)
                throw new Error(
                  "L'identifiant du participant doit être suppérieur à 0"
                );
              return true;
            }
          },
        },
      },
      "participants.*.displayName": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "string")
              throw new Error(
                "Le nom du participant est une chaine de charactère"
              );
            if (value.length < 3)
              throw new Error(
                "Le nom du participant doit être supérieur à 3 charactères"
              );
            if (value.length > 50)
              throw new Error(
                "Le nom du participant doit être inférieure à 50 charactères"
              );
            return true;
          },
        },
      },
      "participants.*.role": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "string")
              throw new Error(
                "Le role du participant est une chaine de charactère"
              );
            if (value == "Invité" || value == "Participant") return true;

            throw new Error(
              "Le role du participant doit être Invitié ou Participant"
            );
          },
        },
      },
    };
  }
}
