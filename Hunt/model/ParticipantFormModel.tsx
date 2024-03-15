export interface IParticipantModel {
  ID: string;
  displayName: string;
}

interface IGuestModel {
  ID: string;
  displayName: string;
  displayNameTouched: boolean;
  displayNameError: string;
  isDisplayNameValid: boolean;
}

export interface IParticipantFormModel {
  participants: IParticipantModel[];
  guest: IGuestModel[];
}

export class ParticipantFormModel implements IParticipantFormModel {
  participants: IParticipantModel[];
  guest: IGuestModel[];

  constructor() {
    this.participants = [];
    this.guest = [];
  }

  static addParticipants(
    participant: IParticipantModel,
    form: ParticipantFormModel
  ) {
    const newParticipants = [...form.participants, participant];
    return {
      ...form,
      participants: newParticipants,
    };
  }

  static deleteParticipant(
    participant: IParticipantModel,
    form: ParticipantFormModel
  ) {
    const newParticipants = form.participants.filter(
      (p) => p.ID !== participant.ID
    );
    return {
      ...form,
      participants: newParticipants,
    };
  }

  static addGuest(guest: IGuestModel, form: ParticipantFormModel) {
    try {
      if (guest.displayName == "") throw "Le nom est obligatoire";

      if (guest.displayName.length < 4)
        throw "Le nombre minimum de caractères autorisés est de : 4";

      if (guest.displayName.length > 30)
        throw "Le nombre maximum de caractères autorisés est de : 30";
      guest.displayNameError = "";
      guest.isDisplayNameValid = true;
    } catch (e: any) {
      guest.displayNameError = e;
      guest.isDisplayNameValid = false;
    } finally {
      const newGuest = [...form.guest, guest];
      return {
        ...form,
        guest: newGuest,
      };
    }
  }

  static deleteGuest(guest: IGuestModel, form: ParticipantFormModel) {
    const newGuest = form.guest.filter((g) => g.ID !== guest.ID);
    return {
      ...form,
      guest: newGuest,
    };
  }
}
