import { spec } from "node:test/reporters";
import ObservationDuckPositionModel from "../observationDuck/ObservationDuckPositionModel";

export interface IObservationModel {
  id: number | undefined;
  hunterId: string;
  huntingSession: number;
  specimen: string;
  isInFlight: boolean;
  isInPose: boolean;
  viewDate: Date;
  killDate: Date;
  quantityKill: number;
  quantityView: number;
  specimenPosition: ObservationDuckPositionModel[];
}

export default class ObservationModel implements IObservationModel {
  id: number | undefined;
  hunterId: string;
  huntingSession: number;
  specimen: string;
  isInFlight: boolean;
  isInPose: boolean;
  viewDate: Date;
  killDate: Date;
  quantityKill: number;
  quantityView: number;
  specimenPosition: ObservationDuckPositionModel[];

  constructor(
    id: number | undefined,
    hunterId: string,
    huntingSession: number,
    specimen: string,
    isInFlight: boolean,
    isInPose: boolean,
    viewDate: Date,
    killDate: Date,
    quantityKill: number,
    quantityView: number,
    specimenPosition: ObservationDuckPositionModel[]
  ) {
    this.id = id;
    this.hunterId = hunterId;
    this.huntingSession = huntingSession;
    this.specimen = specimen;
    this.isInFlight = isInFlight;
    this.isInPose = isInPose;
    this.viewDate = viewDate;
    this.killDate = killDate;
    this.quantityKill = quantityKill;
    this.quantityView = quantityView;
    this.specimenPosition = specimenPosition;
  }

  public static validateBody() {
    return {
      hunterId: {
        custom: {
          options: (value: any) => {
            if (value === undefined)
              throw "L'identifia nt du chasseur est obligatoire";
            if (typeof value !== "string")
              throw new Error(
                "L'identifiant du chasseur doit être une chaine de caractères"
              );
            return true;
          },
        },
      },
      huntingSession: {
        custom: {
          options: (value: any) => {
            if (value !== undefined)
              throw "La session de chasse est obligatoire";
            if (!Number.isInteger(value))
              throw new Error(
                "La session de chasse doit être un nombre entier"
              );
            return true;
          },
        },
      },
      specimen: {
        custom: {
          options: (value: any) => {
            if (typeof value !== "string")
              throw new Error("Le spécimen doit être une chaîne de caractères");
            if (value.length <= 0)
              throw new Error("Le spécimen doit être supérieur à 0 caractère");
            return true;
          },
        },
      },
      isInFlight: {
        custom: {
          options: (value: any) => {
            if (typeof value === "undefined")
              throw new Error("L'indicateur 'isInFlight' est obligatoire");
            if (typeof value !== "boolean")
              throw new Error("L'indicateur 'isInFlight' doit être un booléen");
            return true;
          },
        },
      },
      isInPose: {
        custom: {
          options: (value: any) => {
            if (typeof value === "undefined")
              throw new Error("L'indicateur 'isInPose' est obligatoire");
            if (typeof value !== "boolean")
              throw new Error("L'indicateur 'isInPose' doit être un booléen");
            return true;
          },
        },
      },
      viewDate: {
        custom: {
          options: (value: any) => {
            const date = new Date(value);
            const now = new Date();
            if (isNaN(date.getTime())) {
              throw new Error(
                "La date et heure d'observation fournie est invalide."
              );
            } else if (date <= now) {
              throw new Error(
                "La date et heure d'observation doit antérieur à maintenant."
              );
            }
            return true;
          },
        },
      },
      killDate: {
        custom: {
          options: (value: any) => {
            const date = new Date(value);
            const now = new Date();
            if (isNaN(date.getTime())) {
              throw new Error("La date de tuage fournie est invalide.");
            } else if (date <= now) {
              throw new Error("La date de tuage doit antérieur à maintenant.");
            }
            return true;
          },
        },
      },
      quantityKill: {
        custom: {
          options: (value: any) => {
            if (typeof value === "undefined")
              throw new Error("Le nombre tué est obligatoire.");
            if (isNaN(value))
              throw new Error("Le nombre tué fournie est invalide.");
            if (value < 0)
              throw new Error("Le nombre tué ne peut être négatif");
            return true;
          },
        },
      },
      quantityView: {
        custom: {
          options: (value: any) => {
            if (typeof value === "undefined")
              throw new Error("Le nombre observé est obligatoire.");
            if (isNaN(value))
              throw new Error("Le nombre observé fournie est invalide.");
            if (value <= 0)
              throw new Error("Le nombre observé ne peut être négatif");
            return true;
          },
        },
      },
    };
  }
}
