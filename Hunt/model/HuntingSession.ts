import DuckTeamsModel, { IDuckTeamsModel } from "./DuckTeamsModel";
import HuntingParticipantModel, {
  IHuntingParticipanModel,
} from "./HuntingParticipantModel";
import HutHunterModel, { IHutHunterModel } from "./HutHunterModel";
import WeatherInfoModel, { IWeatherInfoModel } from "./WeatherModel";
import ObservationModel from "./form/ObservationModel";

export interface IHuntingSessionModel {
  id: number | undefined;
  hutID: number | undefined;
  creatorID: string;
  fromDate: Date;
  toDate: Date;
  isFinish: boolean;
  weather?: IWeatherInfoModel;
  participants?: IHutHunterModel[];
  duckTeams?: IDuckTeamsModel[];
  observation?: number[];
}

export default class HuntingSessionModel implements IHuntingSessionModel {
  id: number | undefined;
  hutID: number | undefined;
  creatorID: string;
  fromDate: Date;
  toDate: Date;
  isFinish: boolean;
  weather?: IWeatherInfoModel;
  participants?: IHutHunterModel[];
  duckTeams?: IDuckTeamsModel[];
  observation?: number[];

  constructor(
    id: number | undefined,
    hutID: number | undefined,
    creatorID: string,
    fromDate: Date,
    toDate: Date,
    isFinish: boolean,
    weather?: IWeatherInfoModel,
    participants?: IHutHunterModel[],
    duckTeams?: IDuckTeamsModel[],
    observations?: number[]
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
    this.observation = observations;
  }

  static toJSON() {
    return JSON.stringify(this);
  }
}
