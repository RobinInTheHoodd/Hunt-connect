import ObservationForm from "./ObservationForm";

export interface IObservationFormDuckPosition {
  id: number | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  quantity: number | undefined;
  isKill: boolean | undefined;
  errorMessage: string;
  isValid: boolean;
}

export default class ObservationFormDuckPosition
  implements IObservationFormDuckPosition
{
  id: number | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  quantity: number | undefined;
  isKill: boolean | undefined;
  errorMessage: string;
  isValid: boolean;

  constructor(
    id: number | undefined,
    latitude: number | undefined,
    longitude: number | undefined,
    quantity: number | undefined,
    isKill: boolean | undefined,
    isValid: boolean | undefined
  ) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.quantity = quantity;
    this.isKill = isKill;
    this.errorMessage = "";
    this.isValid = isValid === undefined ? false : isValid;
  }

  static validate(form: ObservationForm): ObservationForm {
    try {
      if (
        (form.quantity.view || form.quantity.kill) != 0 &&
        form.specimenPosition.length == 0
      )
        throw "La position est obligatoire";
      return {
        ...form,
        specimenPositionErreur: "",
      };
    } catch (e: any) {
      return {
        ...form,
        specimenPositionErreur: e,
      };
    }
  }
}
