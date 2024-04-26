export interface IDuckTeamsModel {
  id: number;
  huntingID: number;
  latitude: number;
  longitude: number;
  specimen: string;
  sex: string;
  type: string;
}

export default class DuckTeamsModel implements IDuckTeamsModel {
  id: number;
  huntingID: number;
  latitude: number;
  longitude: number;
  specimen: string;
  sex: string;
  type: string;

  constructor(
    id: number,
    hunting_id: number,
    latitude: number,
    longitude: number,
    specimen: string,
    sex: string,
    type: string
  ) {
    this.id = id;
    this.huntingID = hunting_id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.specimen = specimen;
    this.sex = sex;
    this.type = type;
  }

  public static fromQuery(duck: any) {
    return new DuckTeamsModel(
      duck.id,
      duck.hunting_session_id,
      duck.duck_position.y,
      duck.duck_position.x,
      duck.specimen,
      duck.sex,
      duck.duck_type
    );
  }

  public static getValidation() {
    return {
      "duckTeams.*.huntingID": {
        custom: {
          options: (value: any) => {
            if (value == undefined || value == null) return true;
            else {
              if (typeof value !== "number")
                throw new Error(
                  "L'identifiant de la chasse doit être un chiffre"
                );
              if (value < 0)
                throw new Error(
                  "L'identifiant de la chasse doit être suppérieur de 0"
                );
              return true;
            }
          },
        },
      },
      "duckTeams.*.latitude": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "number")
              throw new Error("la latitude doit être un chiffre");
            return true;
          },
        },
      },
      "duckTeams.*.longitude": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "number")
              throw new Error("la longiture doit être un chiffre");
            return true;
          },
        },
      },
      "duckTeams.*.specimen": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "string")
              throw new Error(
                "le spéciment doit être une chaine de charactères"
              );
            return true;
          },
        },
      },
      "duckTeams.*.sex": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "string")
              throw new Error("le sexe doit être une chaine de charactères");
            if (value == "Mâle" || value == "Femelle") return true;
            throw new Error("le sexe doit être Mâles ou Femelle");
          },
        },
      },
      "duckTeams.*.type": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "string")
              throw new Error("le sexe doit être une chaine de charactères");
            if (value == "Forme" || value == "Vivant") return true;
            throw new Error("le sexe doit être Vivant ou Forme");
          },
        },
      },
    };
  }
}
