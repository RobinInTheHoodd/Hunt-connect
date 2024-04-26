import DuckTeamsModel, { IDuckTeamsModel } from "./DuckTeamsModel";
import HuntingParticipantModel, {
  IHuntingParticipanModel,
} from "./HuntingParticipantModel";
import WeatherInfoModel, { IWeatherInfoModel } from "./WeatherModel";
import ObservationModel from "./form/ObservationModel";

export interface IHutHunterModel {
  hunterID: string;
  displayName?: string;
  email?: string;
  authorizeDay?: IAuthorizeDay;
}

export interface IAuthorizeDay {
  [key: string]: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export default class HutHunterModel implements IHutHunterModel {
  hunterID: string;
  displayName?: string;
  email?: string;
  authorizeDay?: IAuthorizeDay;

  constructor(
    huntID: string,
    authorizeDay?: IAuthorizeDay,
    displayName?: string,
    email?: string
  ) {
    this.hunterID = huntID;
    this.displayName = displayName || undefined;
    this.email = email || undefined;
    this.authorizeDay = authorizeDay || undefined;
  }
}
