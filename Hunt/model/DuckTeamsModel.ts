export interface IDuckTeamsModel {
  id: number | undefined;
  huntingID: number | undefined;
  latitude: number;
  longitude: number;
  specimen: string;
  sex: string;
  type: string;
}

export default class DuckTeamsModel {
  private id: number | undefined;
  private huntingID: number | undefined;
  private latitude: number;
  private longitude: number;
  private specimen: string;
  private sex: string;
  private type: string;

  constructor(
    id: number | undefined,
    huntingID: number | undefined,
    latitude: number,
    longitude: number,
    specimen: string,
    sex: string,
    type: string
  ) {
    this.id = id;
    this.huntingID = huntingID;
    this.latitude = latitude;
    this.longitude = longitude;
    this.specimen = specimen;
    this.sex = sex;
    this.type = type;
  }
}
