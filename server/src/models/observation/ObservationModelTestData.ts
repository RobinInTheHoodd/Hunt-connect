import { generateObservationDuckModelData } from "../observationDuck/ObservationDuckModelTestData";
import ObservationModel from "./ObservationModel";

// Fonction pour générer des données de test pour HuntingParticipantModel
export function generateObservationModelData(
  overrideValues: Partial<ObservationModel> = {}
): ObservationModel {
  // Données par défaut
  const defaultValues: ObservationModel = new ObservationModel(
    1,
    "fsfddf-dsddfdsg",
    12,
    "Canard",
    false,
    true,
    new Date(),
    new Date(),
    2,
    3,
    generateObservationDuckModelData()
  );

  // Surcharge des valeurs par défaut avec celles fournies en paramètre
  return Object.assign(defaultValues, overrideValues);
}
