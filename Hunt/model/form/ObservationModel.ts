import DuckTeamsModel from "../DuckTeamsModel";
import ObservationForm from "../observation/ObservationForm";
import ObservationFormBubble from "../observation/ObservationFormBubbleModel";
import ObservationFormDuckPosition from "../observation/ObservationFormDuckPosition";
import ObservationDuckPosition from "../observation/ObservationFormDuckPosition";
import ObservationFormQuantity from "../observation/ObservationFormQuantity";
import ObservationFormSpecimen from "../observation/ObservationFormSpecimenModel";
import ObservationFormTimeDateModel from "../observation/ObservationFormTimeDateModel";

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
  specimenPosition: ObservationDuckPosition[];
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
  specimenPosition: ObservationDuckPosition[];

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
    specimenPosition: ObservationDuckPosition[]
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

  static fromForm(form: ObservationForm): ObservationModel {
    return new ObservationModel(
      form.id!,
      "",
      form.huntingId,
      form.specimen.specimen!,
      form.bubble.isFly!,
      !form.bubble.isFly,
      form.date.viewDate!,
      form.date.killDate!,
      form.quantity.kill!,
      form.quantity.view!,
      form.specimenPosition
    );
  }

  static fromQuery(form: any): ObservationModel {
    const specimenPosition: ObservationFormDuckPosition[] =
      form.specimenPosition;

    return new ObservationModel(
      form.id,
      form.hunter_id,
      form.hunting_id,
      form.specimen,
      form.is_in_flight,
      form.is_in_pose,
      form.view_date,
      form.kill_date,
      form.quantity_kill,
      form.quantity_view,
      specimenPosition
    );
  }

  static toForm(model: ObservationModel): ObservationForm {
    const newModel = new ObservationForm(
      model.id,
      model.hunterId,
      model.huntingSession
    );

    newModel.specimen = ObservationFormSpecimen.fromModel(0, model.specimen);
    newModel.bubble = ObservationFormBubble.fromModel(model.isInFlight);
    newModel.date = ObservationFormTimeDateModel.fromModel(
      new Date(model.viewDate),
      new Date(model.killDate)
    );

    newModel.quantity = ObservationFormQuantity.fromModel(
      model.quantityView,
      model.quantityKill
    );

    newModel.specimenPosition = model.specimenPosition;
    newModel.isValid = true;

    return newModel;
  }
}
