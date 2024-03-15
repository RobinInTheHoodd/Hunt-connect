import { IDuckTeamsModel } from "./DuckTeamsModel";
import { IHuntingParticipanModel } from "./HuntingPariticpantModel";
import { IWeatherInfoModel } from "./WeatherModel";

export interface IHuntingSessionModel {
  id?: number;
  hutID: number;
  creatorID: string;
  fromDate: Date;
  toDate: Date;
  weather?: IWeatherInfoModel;
  participants?: IHuntingParticipanModel[];
  duckTeams?: IDuckTeamsModel[];
}

export default class HuntingSessionModel implements IHuntingSessionModel {
  id?: number;
  hutID: number;
  creatorID: string;
  fromDate: Date;
  toDate: Date;
  weather?: IWeatherInfoModel;
  participants?: IHuntingParticipanModel[];
  duckTeams?: IDuckTeamsModel[];

  constructor(
    hutID: number,
    creatorID: string,
    fromDate: Date,
    toDate: Date,
    weather?: IWeatherInfoModel,
    participants?: IHuntingParticipanModel[],
    id?: number,
    duckTeams?: IDuckTeamsModel[]
  ) {
    this.id = id;
    this.hutID = hutID;
    this.creatorID = creatorID;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.weather = weather;
    this.participants = participants;
    this.duckTeams = duckTeams;
  }

  public static fromQuery(huntSession: any): IHuntingSessionModel {
    return new HuntingSessionModel(
      huntSession.hut_id,
      huntSession.creator_id,
      huntSession.from_date,
      huntSession.to_date,
      undefined,
      undefined,
      huntSession.id,
      undefined
    );
  }

  public static getValidation() {
    return {
      fromDate: {
        custom: {
          options: (value: any) => {
            const date = new Date(value);
            const now = new Date();
            now.setDate(now.getDate() - 1);

            if (isNaN(date.getTime())) {
              console.log("FFFFFFF");
              throw new Error("La date de commencement fournie est invalide.");
            } else if (date < now) {
              console.log(date);
              console.log(now);
              console.log("XXXXXXXXX");
              throw new Error(
                "La date de commencement doit être dans le futur."
              );
            }
            return true;
          },
        },
      },
      toDate: {
        custom: {
          options: (value: any) => {
            if (value == undefined || value == null) return true;
            const date = new Date(value);
            const now = new Date();
            if (isNaN(date.getTime())) {
              throw new Error("La date de fin fournie est invalide.");
            } else if (date <= now) {
              throw new Error("La date de fin doit être dans le futur.");
            }
            return true;
          },
        },
      },
      creatorID: {
        custom: {
          options: (value: any) => {
            if (typeof value !== "string")
              throw new Error("L'identification est incorrect");
            return true;
          },
        },
      },
    };
  }
}
