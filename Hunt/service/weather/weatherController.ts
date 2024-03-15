import axios, { AxiosResponse } from "axios";
import WeatherInfoModel, {
  IWeatherApiResponse,
} from "../../model/WeatherModel";

export const weatherController = {
  async getWeather(location: string): Promise<WeatherInfoModel> {
    const apiRes: AxiosResponse = await axios.get(
      "https://api.weatherapi.com/v1/current.json?key&q=" +
        location +
        "&aqi=no&lang=fr"
    );

    return WeatherInfoModel.createFromApiResponse(apiRes.data);
  },
};
