import WeatherInfoModel, {
  IWeatherApiResponse,
  IWeatherInfoModel,
} from "../../model/WeatherModel";
import { weatherController } from "./weatherController";

export default class WeatherService {
  async getWeatherByLocation(
    latitude: string,
    longitude: string
  ): Promise<WeatherInfoModel> {
    try {
      const location = latitude + "," + longitude;

      const weatherData: WeatherInfoModel = await weatherController.getWeather(
        location
      );
      return weatherData;
    } catch (e: any) {
      console.log("Erreur");
      throw e;
    }
  }
}
