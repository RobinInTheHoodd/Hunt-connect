import DuckTeamsModel from "./DuckTeamsModel";

// Fonction pour générer des données de test pour HuntingParticipantModel
export function generateDuckTeamsModelData(
  overrideValues: Partial<DuckTeamsModel[]> = []
): DuckTeamsModel[] {
  // Données par défaut
  const defaultValues: DuckTeamsModel[] = [
    new DuckTeamsModel(1, 12, 59.4332, 70.3421, "Canard", "Mâle", "Vivant"),
    new DuckTeamsModel(2, 12, 12.4332, 67.3421, "Canard", "Mâle", "Forme"),
    new DuckTeamsModel(3, 12, 89.4332, 32.3421, "Canard", "Femelle", "Vivant"),
  ];

  // Surcharge des valeurs par défaut avec celles fournies en paramètre
  return Object.assign(defaultValues, overrideValues);
}
