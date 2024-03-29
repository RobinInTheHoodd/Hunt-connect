import { IDuckTeamsModel } from "../model/DuckTeamsModel";
import HuntingParticipantModel, {
  IHuntingParticipanModel,
} from "../model/HuntingParticipantModel";
import HuntingSessionModel, {
  IHuntingSessionModel,
} from "../model/HuntingSession";
import WeatherInfoModel, { IWeatherInfoModel } from "../model/WeatherModel";

import { IWeatherFormModel } from "../model/form/WeatherFormModel";
import { useAppSelector } from "../redux/hook";
import { HuntingSessionController } from "./huntingSessionContrller";

export default class HuntingSessionService {
  async saveHuntingSession(
    creatorID: string,
    weatherForm: IWeatherFormModel,
    duckTeams: IDuckTeamsModel[],
    participantsForm: IHuntingParticipanModel[]
  ) {
    try {
      let toDate = new Date();
      toDate.setDate(toDate.getDate() + 1);

      const weather: IWeatherInfoModel =
        WeatherInfoModel.fromWeatherForm(weatherForm);

      const huntSession = new HuntingSessionModel(
        undefined,
        undefined,
        creatorID,
        new Date(),
        toDate,
        false,
        weather,
        participantsForm,
        duckTeams
      );
      const result = await HuntingSessionController.saveHuntSession(
        huntSession
      );

      huntSession.id = result.data.id;
      return huntSession;
    } catch (e) {
      console.log(e);
    }
  }

  async finishHuntingSessin(huntingSessionId: number) {
    try {
      await HuntingSessionController.finishHuntSession(huntingSessionId);
    } catch (e: any) {
      console.log(e);
    }
  }

  async getCurrentHuntingSession(userID: string) {
    try {
      const res = await HuntingSessionController.getCurrentHuntSession(userID);

      const huntSession: IHuntingSessionModel = res.data;
      return huntSession;
    } catch (e: any) {
      console.log(e);
    }
  }
}
