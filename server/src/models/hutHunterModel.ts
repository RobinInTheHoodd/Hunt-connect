interface IHutHunterModel {
  hunterID: string;
  hutID: number;
  role: string;
  authorizeDay: IAuthorizeDay;
}

export interface IAuthorizeDay {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export default class HutHunterModel {
  hunterID: string;
  hutID: number;
  authorizeDay: IAuthorizeDay;
  role: string;

  constructor(
    hunterID: string,
    hutID: number,
    authorizeDay: IAuthorizeDay,
    role: string
  ) {
    this.hunterID = hunterID;
    this.hutID = hutID;
    this.authorizeDay = authorizeDay;
    this.role = role;
  }

  static generateHutHunterModel(): HutHunterModel {
    return new HutHunterModel(
      "userID",
      9999,
      this.generateAuthorizeDay(),
      "Participant"
    );
  }

  static generateAuthorizeDay(): IAuthorizeDay {
    return {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    };
  }
}
