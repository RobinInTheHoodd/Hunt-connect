import { error } from "console";
import { check } from "express-validator";

export interface IWeatherInfoModel {
  id?: number;
  huntingId?: number;
  name: string;
  tempC: number;
  conditionText: string;
  windKph: number;
  windDir: string;
  humidity: number;
}

export default class WeatherInfoModel implements IWeatherInfoModel {
  id?: number;
  huntingId?: number;
  name: string;
  tempC: number;
  conditionText: string;
  windKph: number;
  windDir: string;
  humidity: number;

  public constructor(
    id: number,
    huntingId: number,
    name: string,
    tempC: number,
    conditionText: string,
    windKph: number,
    windDir: string,
    humidity: number
  ) {
    this.id = id;
    this.huntingId = huntingId;
    this.name = name;
    this.tempC = tempC;
    this.conditionText = conditionText;
    this.windKph = windKph;
    this.windDir = windDir;
    this.humidity = humidity;
  }

  public static fromQuery(weather: any): IWeatherInfoModel {
    return new WeatherInfoModel(
      weather.id,
      weather.hunting_session_id,
      weather.name,
      weather.temp_c,
      weather.condition_text,
      weather.wind_kph,
      weather.wind_dir,
      weather.humidity
    );
  }

  public static getValidation() {
    return {
      "weather.id": {
        custom: {
          options: (value: any) => {
            if (value == undefined || value == null) return true;
            else {
              if (typeof value !== "number")
                throw new Error(
                  "L'identifiant de la méteo doit être un nombre"
                );
              if (value < 0)
                throw new Error(
                  "L'identifiant de la météo doit être supérieur de 0"
                );
              return true;
            }
          },
        },
      },
      "weather.huntingId": {
        custom: {
          options: (value: any) => {
            if (value == undefined || value == null) return true;
            else {
              if (typeof value !== "number")
                throw new Error(
                  "L'identifiant de la chasse doit être un nombre"
                );
              if (value < 0)
                throw new Error(
                  "L'identifiant de la chasse doit être supérieur de 0"
                );
              return true;
            }
          },
        },
      },
      "weather.name": {
        custom: {
          options: (value: any) => {
            if (value == undefined || value == null) true;
            else {
              if (typeof value !== "string")
                throw new Error("Le nom doit être une chaîne de charactère");

              if (value.length < 4)
                throw new Error("Le nom doit être supérieur à 4 charactère");

              if (value.length > 20)
                throw new Error("Le nom doit être inférieur à 20 charactère");
            }
            return true;
          },
        },
      },
      "weather.tempC": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "number")
              throw new Error("La température doit être un nombre");

            if (value < -30)
              throw new Error("La température minimum est de -30");

            if (value > 50) throw new Error("La température maximum est de 50");
            return true;
          },
        },
      },

      "weather.conditionText": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "string")
              throw new Error(
                "La condition climatique dois être une chaine de charactère"
              );
            if (value.length > 100)
              throw new Error(
                "La condition climatique dois être inférieur à 100 charactères"
              );
            if (value.length < 4)
              throw new Error(
                "La condition climatique dois être supérieur à 4 charactères"
              );
            return true;
          },
        },
      },
      "weather.windKph": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "number")
              throw new Error("La vitesse du vent doit être un nombre");
            if (value < 0)
              throw new Error("La vitesse du vent doit être positif");
            if (value > 30)
              throw new Error(
                "La vitesse du vent doit être inférieur à 30km/h"
              );
            return true;
          },
        },
      },
      "weather.windDir": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "string")
              throw new Error(
                "La direction du vent doit être une chaine de charactère"
              );
            if (value.length < 3)
              throw new Error(
                "La directoin du vent doit être supérieur de 2 charactères"
              );
            if (value.length > 30)
              throw new Error(
                "La directoin du vent doit être inférieur à 30 charactères"
              );
            return true;
          },
        },
      },
      "weather.humidity": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "number")
              throw new Error("L'humidité doit ètre un nombre");
            if (value < 0)
              throw new Error("L'humidité doit ètre supérieur à 0%");
            if (value > 100)
              throw new Error("L'humidité doit ètre inférrieur à 100%");
            return true;
          },
        },
      },
    };
  }
}
