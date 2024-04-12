import ObservationDuckPositionModel from "./ObservationDuckPositionModel";

// Fonction pour générer des données de test pour HuntingParticipantModel
export function generateObservationDuckModelData(
  overrideValues: Partial<ObservationDuckPositionModel[]> = []
): ObservationDuckPositionModel[] {
  // Données par défaut
  const defaultValues: ObservationDuckPositionModel[] = [
    new ObservationDuckPositionModel(1, 59.4332, 20.3421, 2, false),
    new ObservationDuckPositionModel(2, 32.4332, 22.3421, 1, true),
    new ObservationDuckPositionModel(3, 10.4332, 44.3421, 5, true),
    new ObservationDuckPositionModel(4, 70.4332, 32.3421, 8, false),
  ];

  // Surcharge des valeurs par défaut avec celles fournies en paramètre
  return Object.assign(defaultValues, overrideValues);
}
