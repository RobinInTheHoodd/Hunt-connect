import { IHutHunterModel } from "./HutHunterModel";

export interface IHutModel {
  id: number | undefined;
  huntSession: number[];
  hutName: string;
  hutNumber: number;
  location: string;
  hunter: IHutHunterModel[];
  ownerID: string;
  day: {
    end: Date;
    start: Date;
  };
}

export default class HutModel implements IHutModel {
  id: number | undefined;
  huntSession: number[];
  hutName: string;
  hutNumber: number;
  location: string;
  hunter: IHutHunterModel[];
  ownerID: string;
  day: {
    end: Date;
    start: Date;
  };

  constructor(
    id: number | undefined,
    huntSession: number[],
    hutName: string,
    hutNumber: number,
    location: string,
    hunter: IHutHunterModel[],
    ownerID: string,
    day: {
      end: Date;
      start: Date;
    }
  ) {
    this.id = id;
    this.huntSession = huntSession;
    this.hutName = hutName;
    this.hutNumber = hutNumber;
    this.location = location;
    this.hunter = hunter;
    this.ownerID = ownerID;
    this.day = day;
  }

  static toJSON() {
    return JSON.stringify(this);
  }

  static fromHuntSessionFirebase = (hut: any) => {
    return new HutModel(
      hut.id,
      hut.huntSession,
      hut.hut_name,
      hut.hut_number,
      hut.location,
      hut.hunter,
      hut.ownerId,
      { end: hut.day.end, start: hut.day.start }
    );
  };
}
