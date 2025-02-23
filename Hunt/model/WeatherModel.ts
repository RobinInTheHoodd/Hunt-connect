import { IWeatherFormModel } from "./form/WeatherFormModel";

export interface IWeatherApiResponse {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
    wind_kph: number;
    wind_dir: string;
    humidity: number;
  };
}

export interface IWeatherInfoModel {
  id: number | undefined;
  huntingID: number | undefined;
  name: string;
  tempC: number;
  conditionText: string;
  windKph: number;
  windDir: string;
  humidity: number;
}

export default class WeatherInfoModel {
  id: number | undefined;
  huntingID: number | undefined;
  name: string;
  tempC: number;
  conditionText: string;
  windKph: number;
  windDir: string;
  humidity: number;

  public constructor(
    id: number | undefined,
    huntingID: number | undefined,
    name: string,
    tempC: number,
    conditionText: string,
    windKph: number,
    windDir: string,
    humidity: number
  ) {
    this.id = id;
    this.huntingID = huntingID;
    this.name = name;
    this.tempC = tempC;
    this.conditionText = conditionText;
    this.windKph = windKph;
    this.windDir = windDir;
    this.humidity = humidity;
  }

  public static createFromApiResponse(
    apiResponse: IWeatherApiResponse
  ): WeatherInfoModel {
    console.log(apiResponse);
    return new WeatherInfoModel(
      undefined,
      undefined,
      apiResponse.location.name,
      apiResponse.current.temp_c,
      apiResponse.current.condition.text,
      apiResponse.current.wind_kph,
      apiResponse.current.wind_dir,
      apiResponse.current.humidity
    );
  }

  public static fromWeatherForm(weatherForm: IWeatherFormModel) {
    return new WeatherInfoModel(
      undefined,
      undefined,
      weatherForm.fullName,
      weatherForm.tempC!,
      weatherForm.conditionText,
      weatherForm.windKph!,
      weatherForm.windDir,
      weatherForm.humidity!
    );
  }

  public static fromFirebase(weather: any) {
    return new WeatherInfoModel(
      undefined,
      undefined,
      weather.name,
      weather.tempC,
      weather.conditionText,
      weather.windKph,
      weather.windDir,
      weather.humidity
    );
  }

  public getName() {
    return this.name;
  }
  public getTempC() {
    return this.tempC;
  }
  public getConditionText() {
    return this.conditionText;
  }
  public getWindKph() {
    return this.windKph;
  }
  public getWindDir() {
    return this.windDir;
  }
  public getHumidity() {
    return this.humidity;
  }

  public toString(): string {
    return `Weather in ${this.name}: ${this.tempC}°C, ${this.conditionText}, Wind: ${this.windKph} KPH ${this.windDir}, Humidity: ${this.humidity}%`;
  }
}
