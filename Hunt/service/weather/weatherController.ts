import axios, { AxiosResponse } from "axios";
import WeatherInfoModel, {
  IWeatherApiResponse,
} from "../../model/WeatherModel";

export const weatherController = {
  async getWeather(location: string): Promise<WeatherInfoModel> {
    const apiRes: AxiosResponse = await axios.get(
      "https://api.weatherapi.com/v1/current.json?key=9868117782b04e19b07152925240803&q=" +
        location +
        "&aqi=no&lang=fr"
    );

    return WeatherInfoModel.createFromApiResponse(apiRes.data);
  },
};
