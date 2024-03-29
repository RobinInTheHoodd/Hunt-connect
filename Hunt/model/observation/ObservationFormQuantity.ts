interface IObservationFormQuantity {
  view: number | undefined;
  viewErrorMessage: string;
  viewIsValid: boolean;
  kill: number | undefined;
  killErrorMessage: string;
  killIsValid: boolean;
}

export default class ObservationFormQuantity
  implements IObservationFormQuantity
{
  view: number | undefined;
  viewErrorMessage: string;
  viewIsValid: boolean;
  kill: number | undefined;
  killErrorMessage: string;
  killIsValid: boolean;

  constructor(
    view: number | undefined,
    viewIsValid: boolean | undefined,
    kill: number | undefined,
    killIsValid: boolean | undefined
  ) {
    this.view = view;
    this.viewErrorMessage = "";
    this.viewIsValid = viewIsValid === undefined ? false : viewIsValid;
    this.kill = kill;
    this.killErrorMessage = "";
    this.killIsValid = killIsValid === undefined ? false : killIsValid;
  }

  static init() {
    return new ObservationFormQuantity(
      undefined,
      undefined,
      undefined,
      undefined
    );
  }

  static fromModel(view: number, kill: number) {
    return new ObservationFormQuantity(view, true, kill, true);
  }

  static validateView(
    view: number,
    form: ObservationFormQuantity
  ): ObservationFormQuantity {
    let errorMessage = "";
    let isValid = false;

    try {
      if (typeof view == "undefined") throw "Le champ est obligatoire.";
      if (typeof view == "string") throw "Le champs doit être un nombre";
      if (view > 150) throw "Le nombre ne peut excédé 150";
      if (view <= 0) throw "Le nombre doit être supérieur à 0";
      isValid = true;
    } catch (e: any) {
      errorMessage = e;
    } finally {
      return {
        ...form,
        view: view,
        viewErrorMessage: errorMessage,
        viewIsValid: isValid,
      };
    }
  }

  static validateKill(
    kill: number,
    form: ObservationFormQuantity
  ): ObservationFormQuantity {
    let errorMessage = "";
    let isValid = false;

    try {
      if (typeof kill == "undefined") throw "Le champ est obligatoire.";
      if (typeof kill == "string") throw "Le champs doit être un nombre";
      if (kill > 150) throw "Le nombre ne peut excédé 150";
      if (kill > form.view!)
        throw "Le nombre tué ne peut être supérieure à celle vue";
      if (kill < 0) throw "Le nombre doit être supérieur à 0";
      isValid = true;
    } catch (e: any) {
      errorMessage = e;
    } finally {
      return {
        ...form,
        kill: kill,
        killErrorMessage: errorMessage,
        killIsValid: isValid,
      };
    }
  }
}
