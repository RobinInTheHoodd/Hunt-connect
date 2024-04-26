import { generateDuckTeamsModelData } from "../duckTeams/DuckTeamsModelTestData";
import {
  generateHuntingHunter,
  generateHuntingParticipantModelData,
} from "../huntingParticipant/huntingParticipantModelTestData";
import { generateWeatherModelData } from "../weather/WeatherModelTestData";
import HuntingSessionModel from "./HuntingSessionModel";

// Fonction pour générer des données de test pour HuntingParticipantModel
export function generateHuntingSessionModelData(
  overrideValues: Partial<HuntingSessionModel> = {}
): HuntingSessionModel {
  // Données par défaut
  const defaultValues: HuntingSessionModel = new HuntingSessionModel(
    2,
    "fhfsdsf-fdsvd",
    new Date(),
    new Date(),
    false,
    generateWeatherModelData(),
    generateHuntingHunter(),
    1,
    generateDuckTeamsModelData()
  );

  // Surcharge des valeurs par défaut avec celles fournies en paramètre
  return Object.assign(defaultValues, overrideValues);
}
