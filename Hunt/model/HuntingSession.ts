import { IDuckTeamsModel } from "./DuckTeamsModel";
import { IHuntingParticipanModel } from "./HuntingParticipantModel";
import { IWeatherInfoModel } from "./WeatherModel";

export interface IHuntingSessionModel {
  id: number | undefined;
  hutID: number | undefined;
  creatorID: string;
  fromDate: Date;
  toDate: Date;
  isFinish: boolean;
  weather?: IWeatherInfoModel;
  participants?: IHuntingParticipanModel[];
  duckTeams?: IDuckTeamsModel[];
}

export default class HuntingSessionModel implements IHuntingSessionModel {
  id: number | undefined;
  hutID: number | undefined;
  creatorID: string;
  fromDate: Date;
  toDate: Date;
  isFinish: boolean;
  weather?: IWeatherInfoModel;
  participants?: IHuntingParticipanModel[];
  duckTeams?: IDuckTeamsModel[];

  constructor(
    id: number | undefined,
    hutID: number | undefined,
    creatorID: string,
    fromDate: Date,
    toDate: Date,
    isFinish: boolean,
    weather?: IWeatherInfoModel,
    participants?: IHuntingParticipanModel[],
    duckTeams?: IDuckTeamsModel[]
  ) {
    this.id = id;
    this.hutID = hutID;
    this.creatorID = creatorID;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.isFinish = isFinish;
    this.weather = weather;
    this.participants = participants;
    this.duckTeams = duckTeams;
  }
}
