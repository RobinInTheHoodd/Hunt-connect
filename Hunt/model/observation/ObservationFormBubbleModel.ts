interface IObservationFormBubble {
  isFly: boolean | undefined;
  errorMessage: string;
  isvalid: boolean;
}

export default class ObservationFormBubble implements IObservationFormBubble {
  isFly: boolean | undefined;
  errorMessage: string;
  isvalid: boolean;

  constructor(isFly: boolean | undefined, isvalid: boolean | undefined) {
    this.isFly = isFly;
    this.errorMessage = "";
    this.isvalid = isvalid === undefined ? false : isvalid;
  }

  static init() {
    return new ObservationFormBubble(undefined, undefined);
  }

  static fromModel(isFly: boolean) {
    return new ObservationFormBubble(isFly, true);
  }

  static validateBubble(form: ObservationFormBubble) {
    let errorMessage: string = "";
    let isValid: boolean = false;
    try {
      if (form.isFly === undefined) throw "Le champs est obligatoire";
      isValid = true;
    } catch (e: any) {
      errorMessage = e;
    } finally {
      return {
        ...form,
        errorMessage: errorMessage,
        isValid: isValid,
      };
    }
  }
}
