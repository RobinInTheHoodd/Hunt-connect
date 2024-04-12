import WeatherInfoModel from "./WeatherModel";

// Fonction pour générer des données de test pour HuntingParticipantModel
export function generateWeatherModelData(
  overrideValues: Partial<WeatherInfoModel> = {}
): WeatherInfoModel {
  // Données par défaut
  const defaultValues: WeatherInfoModel = new WeatherInfoModel(
    1,
    12,
    "name",
    20,
    "Nuageux",
    5,
    "Nord/Est",
    40
  );

  // Surcharge des valeurs par défaut avec celles fournies en paramètre
  return Object.assign(defaultValues, overrideValues);
}
