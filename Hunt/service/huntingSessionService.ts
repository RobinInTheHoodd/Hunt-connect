import { firebase } from "@react-native-firebase/database";
import { IDuckTeamsModel } from "../model/DuckTeamsModel";
import HuntingSessionModel, {
  IHuntingSessionModel,
} from "../model/HuntingSession";
import { IHutHunterModel } from "../model/HutHunterModel";
import WeatherInfoModel, { IWeatherInfoModel } from "../model/WeatherModel";
import { IWeatherFormModel } from "../model/form/WeatherFormModel";
import { HuntingSessionController } from "./huntingSessionContrller";
import { addHuntSession } from "../redux/reducers/huntSessionSlice";

export default class HuntingSessionService {
  async saveHuntingSession(
    creatorID: string,
    hutID: number,
    weatherForm: IWeatherFormModel,
    duckTeams: IDuckTeamsModel[],
    participantsForm: IHutHunterModel[]
  ) {
    try {
      let toDate = new Date();
      toDate.setDate(toDate.getDate() + 1);

      const weather: IWeatherInfoModel =
        WeatherInfoModel.fromWeatherForm(weatherForm);

      const huntSession = new HuntingSessionModel(
        undefined,
        hutID,
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

      const huntSession: IHuntingSessionModel =
        res.data == "" ? undefined : res.data;
      return huntSession;
    } catch (e: any) {
      console.log(e);
    }
  }

  async getByID(huntingID: number) {
    try {
      const res = await HuntingSessionController.getByID(huntingID);

      const huntSession: IHuntingSessionModel = res.data;
      return huntSession;
    } catch (e: any) {
      throw e;
    }
  }

  async getHistoryHuntingSession(userID: string) {
    let huntsID: any = [];
    let huntsDate: any = [];

    try {
      const userRef = firebase.database().ref("/user/" + userID);
      const huntRef = firebase.database().ref("/huntSessions/");

      await userRef.once("value", (snapShot) => {
        if (snapShot.exists()) {
          huntsID = snapShot.val().huntSession;
        }
      });

      for (const id of huntsID) {
        await huntRef.child(id.toString()).once("value", (snapShot) => {
          if (snapShot.exists()) {
            let hunt = snapShot.val();
            huntsDate.push({
              id: id,
              fromDate: new Date(hunt.fromDate),
            });
          }
        });
      }
      return huntsDate;
    } catch (e: any) {
      console.log(e);
      return [];
    }
  }

  async fetHuntSession(huntID: string, dispatch: any) {
    let hunt;

    try {
      const huntRef = firebase.database().ref("/huntSessions/" + huntID);

      await huntRef.once("value", (snapShot) => {
        if (snapShot.exists()) {
          hunt = snapShot.val();
          dispatch(addHuntSession(JSON.stringify(hunt)));
        }
      });

      return;
    } catch (e: any) {
      console.log(e);
      return [];
    }
  }
}
