import { isValidElement } from "react";
import ObservationFormSpecimen from "./ObservationFormSpecimenModel";
import ObservationFormBubble from "./ObservationFormBubbleModel";
import ObservationFormTimeDateModel from "./ObservationFormTimeDateModel";
import ObservationFormDuckPosition from "./ObservationFormDuckPosition";
import ObservationFormQuantity from "./ObservationFormQuantity";

interface IObservationForm {
  id: number | undefined;
  hunterId: string;
  huntingId: number;
  specimen: ObservationFormSpecimen;
  bubble: ObservationFormBubble;
  date: ObservationFormTimeDateModel;
  quantity: ObservationFormQuantity;
  specimenPosition: ObservationFormDuckPosition[];
  specimenPositionErreur: string;
  isValid: boolean;
}

export default class ObservationForm implements IObservationForm {
  id: number | undefined;
  hunterId: string;
  huntingId: number;
  specimen: ObservationFormSpecimen;
  bubble: ObservationFormBubble;
  date: ObservationFormTimeDateModel;
  quantity: ObservationFormQuantity;
  specimenPositionErreur: string;
  specimenPosition: ObservationFormDuckPosition[];
  isValid: boolean;

  constructor(id: number | undefined, hunterId: string, huntingId: number) {
    this.id = id;
    this.hunterId = hunterId;
    this.huntingId = huntingId;
    this.specimenPositionErreur = "";
    this.specimen = ObservationFormSpecimen.init();
    this.bubble = ObservationFormBubble.init();
    this.date = ObservationFormTimeDateModel.init();
    this.quantity = ObservationFormQuantity.init();
    this.specimenPosition = [];
    this.isValid = false;
  }

  static isValide(form: ObservationForm): ObservationForm {
    let formSpecimen = ObservationFormSpecimen.validateForm(
      form.specimen.id!,
      form.specimen.specimen!,
      form.specimen
    );
    let formBubble = ObservationFormBubble.validateBubble(form.bubble);
    let formDate = ObservationFormTimeDateModel.validateKillDate(
      form.date.killDate!,
      form.date
    );
    formDate = ObservationFormTimeDateModel.validateViewDate(
      form.date.viewDate!,
      formDate
    );

    let formQuantity = ObservationFormQuantity.validateView(
      form.quantity.view!,
      form.quantity
    );
    formQuantity = ObservationFormQuantity.validateKill(
      form.quantity.kill!,
      formQuantity
    );

    let specimenPosition: ObservationForm =
      ObservationFormDuckPosition.validate(form);

    let rs = {
      ...specimenPosition,
      specimen: formSpecimen,
      bubble: formBubble,
      date: formDate,
      quantity: formQuantity,
    };

    if (
      rs.specimen.isValid &&
      rs.bubble.isvalid &&
      rs.date.killDateIsValid &&
      rs.date.viewDateIsValid &&
      rs.quantity.killIsValid &&
      rs.quantity.viewIsValid
    ) {
      return {
        ...rs,
        id: form.id,
        isValid: true,
        huntingId: form.huntingId,
      };
    } else {
      return {
        ...rs,
        id: form.id,
        isValid: false,
        huntingId: form.huntingId,
      };
    }
  }
}
