import { faL } from "@fortawesome/free-solid-svg-icons";

interface IObservationFormTimeDate {
  viewDate: Date | undefined;
  viewDateErrorMessage: string;
  viewDateIsValid: boolean;
  killDate: Date | undefined;
  killDateErrorMessage: string;
  killDateIsValid: boolean;
}

export default class ObservationFormTimeDateModel
  implements IObservationFormTimeDate
{
  viewDate: Date | undefined;
  viewDateErrorMessage: string;
  viewDateIsValid: boolean;
  killDate: Date | undefined;
  killDateErrorMessage: string;
  killDateIsValid: boolean;

  constructor(
    viewDate: Date | undefined,
    viewDateIsValid: boolean | undefined,
    killDate: Date | undefined,
    killDateIsValid: boolean | undefined
  ) {
    this.viewDate = viewDate === undefined ? new Date() : viewDate;
    this.viewDateErrorMessage = "";
    this.viewDateIsValid =
      viewDateIsValid === undefined ? false : viewDateIsValid;
    this.killDate = killDate === undefined ? new Date() : killDate;
    this.killDateErrorMessage = "";
    this.killDateIsValid =
      killDateIsValid === undefined ? false : killDateIsValid;
  }

  static init() {
    return new ObservationFormTimeDateModel(
      undefined,
      undefined,
      undefined,
      undefined
    );
  }

  static fromModel(viewDate: Date, killDate: Date) {
    return new ObservationFormTimeDateModel(viewDate, true, killDate, true);
  }

  static validateKillDate(killDate: Date, form: ObservationFormTimeDateModel) {
    let killDateErrorMessage: string = "";
    let killDateIsValid: boolean = false;
    let rs: any = this.validateViewDate(form.viewDate!, form);

    try {
      if (killDate < rs.viewDate!)
        throw "La date et l'heure tué ne peut être inférieur à la date vue";
      if (killDate === undefined) throw "La date et l'heure sont obligatoire";
      killDateIsValid = true;
    } catch (e: any) {
      killDateErrorMessage = e;
    } finally {
      return {
        ...rs,
        killDate: killDate,
        killDateErrorMessage: killDateErrorMessage,
        killDateIsValid: killDateIsValid,
      };
    }
  }
  static validateViewDate(viewDate: Date, form: ObservationFormTimeDateModel) {
    let viewDateErrorMessage: string = "";
    let viewDateIsValid: boolean = false;

    try {
      if (viewDate > form.killDate!)
        throw "La date et l'heure vue ne peut être inférieur à la date tué";
      if (viewDate === undefined) throw "La date et l'heure sont obligatoire";
      viewDateIsValid = true;
    } catch (e: any) {
      viewDateErrorMessage = e;
    } finally {
      return {
        ...form,
        viewDate: viewDate,
        viewDateErrorMessage: viewDateErrorMessage,
        viewDateIsValid: viewDateIsValid,
      };
    }
  }
}
