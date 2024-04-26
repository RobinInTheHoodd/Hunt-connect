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
  id: number | undefined;
  huntingID: number | undefined;
  latitude: number;
  longitude: number;
  specimen: string;
  sex: string;
  type: string;

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

  public static fromFirebase(duckTeams: any[]) {
    let newObject: IDuckTeamsModel[] = [];
    for (const duck of duckTeams) {
      newObject.push(
        new DuckTeamsModel(
          duck.id,
          undefined,
          duck.latitude,
          duck.longitude,
          duck.specimen,
          duck.sex,
          duck.type
        )
      );
    }
    return newObject;
  }
}
