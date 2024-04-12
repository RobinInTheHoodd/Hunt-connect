export interface IObservationDuckPositionModel {
  id: number | undefined;
  latitude: number;
  longitude: number;
  quantity: number;
  isKill: boolean;
}
export default class ObservationDuckPositionModel
  implements IObservationDuckPositionModel
{
  id: number | undefined;
  latitude: number;
  longitude: number;
  quantity: number;
  isKill: boolean;

  constructor(
    id: number | undefined,
    latitude: number,
    longitude: number,
    quantity: number,
    isKill: boolean
  ) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.quantity = quantity;
    this.isKill = isKill;
  }

  public static fromQuery(duck: any) {
    return new ObservationDuckPositionModel(
      duck.id,
      duck.position.y,
      duck.position.x,
      duck.quantity,
      duck.is_kill
    );
  }

  public static validateBody() {
    return {
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
      "duckTeams.*.quantity": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "number")
              throw new Error("La quantité doit être un nombre");
            return true;
          },
        },
      },
      "duckTeams.*.isKill": {
        custom: {
          options: (value: any) => {
            if (typeof value !== "boolean")
              throw new Error("isKill doit être un boolean");
            return true;
          },
        },
      },
    };
  }
}
