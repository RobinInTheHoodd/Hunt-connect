import { Settings } from "react-native";
import { IWeatherInfoModel } from "../WeatherModel";

export interface IWeatherFormModel {
  fullName: string;
  fullNameTouched: boolean;
  fullNameError: string;
  isFullNameValid: boolean;

  tempC: number | null;
  tempCTouched: boolean;
  tempCError: string;
  isTempCValid: boolean;

  conditionText: string;
  conditionTextTouched: boolean;
  conditionTextError: string;
  isConditionTextValid: boolean;

  windKph: number | null;
  windKphTouched: boolean;
  windKphError: string;
  isWindKphValid: boolean;

  windDir: string;
  windDirTouched: boolean;
  windDirError: string;
  isWindDirValid: boolean;

  humidity: number | null;
  humidityTouched: boolean;
  humidityError: string;
  isHumidityValid: boolean;

  isFormValid: boolean;
}

export class WeatherFormModel implements IWeatherFormModel {
  fullName: string;
  fullNameTouched: boolean;
  fullNameError: string;
  isFullNameValid: boolean;
  tempC: number | null;
  tempCTouched: boolean;
  tempCError: string;
  isTempCValid: boolean;
  conditionText: string;
  conditionTextTouched: boolean;
  conditionTextError: string;
  isConditionTextValid: boolean;
  windKph: number | null;
  windKphTouched: boolean;
  windKphError: string;
  isWindKphValid: boolean;
  windDir: string;
  windDirTouched: boolean;
  windDirError: string;
  isWindDirValid: boolean;
  humidity: number | null;
  humidityTouched: boolean;
  humidityError: string;
  isHumidityValid: boolean;
  isFormValid: boolean;

  constructor() {
    this.fullName = "";
    this.fullNameTouched = false;
    this.fullNameError = "";
    this.isFullNameValid = false;
    this.tempC = null;
    this.tempCTouched = false;
    this.tempCError = "";
    this.isTempCValid = false;
    this.conditionText = "";
    this.conditionTextTouched = false;
    this.conditionTextError = "";
    this.isConditionTextValid = false;
    this.windKph = null;
    this.windKphTouched = false;
    this.windKphError = "";
    this.isWindKphValid = false;
    this.windDir = "";
    this.windDirTouched = false;
    this.windDirError = "";
    this.isWindDirValid = false;
    this.humidity = null;
    this.humidityTouched = false;
    this.humidityError = "";
    this.isHumidityValid = false;
    this.isFormValid = false;
  }

  static setTempC(value: number, form: WeatherFormModel): IWeatherFormModel {
    const maxTemp = 50;
    const minTemp = -20;
    let isValid = true;
    let errorMessage = "";

    try {
      if (value == null) throw "La température est obligatoire";
      if (value > maxTemp) throw "La température maximum autorisé : 50°";
      if (value < minTemp) throw "La température minimum autorisé : -20°";
    } catch (e: any) {
      isValid = false;

      errorMessage = e;
    } finally {
      return {
        ...form,
        tempC: value,
        tempCTouched: true,
        isTempCValid: isValid,
        tempCError: errorMessage,
      };
    }
  }

  static setConditionText(
    value: string,
    form: WeatherFormModel
  ): IWeatherFormModel {
    const maxLenght = 50;
    const minLenght = 5;
    let isValid = true;
    let errorMessage = "";

    try {
      if (value == null || value == "")
        throw "La condition climatique est obligatoire";
      if (value.length > maxLenght) throw "Charactère maximum autorisé : 50";
      if (value.length < minLenght) throw "Charactère minimum autorisé : 5";
    } catch (e: any) {
      isValid = false;
      errorMessage = e;
    } finally {
      return {
        ...form,
        conditionText: value,
        conditionTextTouched: true,
        isConditionTextValid: isValid,
        conditionTextError: errorMessage,
      };
    }
  }

  static setwindKph(value: number, form: WeatherFormModel): IWeatherFormModel {
    const maxLenght = 50;
    const minLenght = 0;
    let isValid = true;
    let errorMessage = "";

    try {
      if (value == null) throw "La vitesse du vent est obligatoire";
      if (value > maxLenght) throw "Vitesse maximum du vent autorisé : 50 km/h";
      if (value < minLenght) throw "Vitesse minimum du vent autorisé : 0 km/h";
    } catch (e: any) {
      isValid = false;
      errorMessage = e;
    } finally {
      return {
        ...form,
        windKph: value,
        windKphTouched: true,
        isWindKphValid: isValid,
        windKphError: errorMessage,
      };
    }
  }

  static setwindDir(value: string, form: WeatherFormModel): IWeatherFormModel {
    const maxLenght = 30;
    const minLenght = 1;
    let isValid = true;
    let errorMessage = "";

    try {
      if (value == "" || value == null)
        throw "La direction du vent est obligatoire";
      if (value.length > maxLenght)
        throw "Le charactère maximum de la direction du vent autorisé : 30 ";
      if (value.length < minLenght)
        throw "Le charactère minimum de la direction du vent autorisé : 1";
    } catch (e: any) {
      isValid = false;
      errorMessage = e;
    } finally {
      return {
        ...form,
        windDir: value,
        windDirTouched: true,
        isWindDirValid: isValid,
        windDirError: errorMessage,
      };
    }
  }

  static sethumidity(value: number, form: WeatherFormModel): IWeatherFormModel {
    const maxLenght = 100;
    const minLenght = 0;
    let isValid = true;
    let errorMessage = "";

    try {
      console.log(typeof value);
      if (typeof value != "number" && value !== "")
        throw "Le taux d'humidité ne contient que des chiffres";
      if (value == null) throw "Le taux d'humidité est obligatoire";
      if (value > maxLenght) throw "Le taux d'humidité maximum autorisé : 100%";
      if (value < minLenght) throw "Le taux d'humiditéminimum autorisé : 1";
    } catch (e: any) {
      isValid = false;
      errorMessage = e;
    } finally {
      return {
        ...form,
        humidity: value,
        humidityTouched: true,
        isHumidityValid: isValid,
        humidityError: errorMessage,
      };
    }
  }
  static isValidForm(form: WeatherFormModel) {
    let temp = form;
    temp = this.setTempC(form.tempC!, temp);
    temp = this.setConditionText(form.conditionText, temp);
    temp = this.setwindKph(form.windKph!, temp);
    temp = this.setwindDir(form.windDir, temp);
    temp = this.sethumidity(form.humidity!, temp);

    if (
      temp.isTempCValid &&
      temp.isConditionTextValid &&
      temp.isWindKphValid &&
      temp.isWindDirValid &&
      temp.isHumidityValid
    ) {
      return {
        ...temp,
        isFormValid: true,
      };
    } else
      return {
        ...temp,
        isFormValid: false,
      };
  }

  static fromWeatherModel(weather: IWeatherInfoModel) {
    const formWeather = new WeatherFormModel();

    let temp = formWeather;
    temp = this.setTempC(weather.tempC!, temp);
    temp = this.setConditionText(weather.conditionText, temp);
    temp = this.setwindKph(weather.windKph!, temp);
    temp = this.setwindDir(weather.windDir, temp);
    temp = this.sethumidity(weather.humidity!, temp);

    if (
      temp.isTempCValid &&
      temp.isConditionTextValid &&
      temp.isWindKphValid &&
      temp.isWindDirValid &&
      temp.isHumidityValid
    ) {
      return {
        ...temp,
        isFormValid: true,
      };
    } else
      return {
        ...temp,
        isFormValid: false,
      };
  }
}
