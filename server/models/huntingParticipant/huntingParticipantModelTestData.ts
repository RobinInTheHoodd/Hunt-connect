import HuntingParticipantModel from "./HuntingPariticpantModel";

// Fonction pour générer des données de test pour HuntingParticipantModel
export function generateHuntingParticipantModelData(
  overrideValues: Partial<HuntingParticipantModel[]> = []
): HuntingParticipantModel[] {
  // Données par défaut
  const defaultValues: HuntingParticipantModel[] = [
    new HuntingParticipantModel("Robin Mazouni", "Participant", "12345678912"),
    new HuntingParticipantModel("Pierre chelou", "Participant", "56598043234"),
    new HuntingParticipantModel("Samuel taratata", "Invité", "98753240183"),
    new HuntingParticipantModel("Cassis menthe", "Invité", "21375321758"),
  ];

  // Surcharge des valeurs par défaut avec celles fournies en paramètre
  return Object.assign(defaultValues, overrideValues);
}
