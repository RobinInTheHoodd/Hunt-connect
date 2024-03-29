interface IObservationFormSpecimen {
  id: number | undefined;
  specimen: string | undefined;
  isValid: boolean | undefined;
  errorMessage: string;
}

export default class ObservationFormSpecimen
  implements IObservationFormSpecimen
{
  id: number | undefined;
  specimen: string | undefined;
  isValid: boolean | undefined;
  errorMessage: string;

  constructor(
    id: number | undefined,
    specimen: string | undefined,
    isValid: boolean | undefined
  ) {
    this.id = id;
    this.specimen = specimen;
    this.isValid = isValid === undefined ? false : isValid;
    this.errorMessage = "";
  }

  static init(): ObservationFormSpecimen {
    return new ObservationFormSpecimen(undefined, undefined, undefined);
  }

  static fromModel(id: number, specimen: string) {
    return new ObservationFormSpecimen(id, specimen, true);
  }

  static validateForm(
    id: number,
    specimen: string,
    form: ObservationFormSpecimen
  ) {
    let errorMessage: string = "";
    let isValid: boolean = false;
    try {
      if (id === undefined || specimen === undefined || specimen === "")
        throw "Un spécimen doit être sélectionné.";

      isValid = true;
    } catch (e: any) {
      errorMessage = e;
    } finally {
      return {
        id: id,
        specimen: specimen,
        isValid: isValid,
        errorMessage: errorMessage,
      };
    }
  }
}
