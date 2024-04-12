import RegisterRequest, { IRegisterRequest } from "./RegisterRequest";

export function generateRegisterRequestModelData(
  overrideValues: Partial<IRegisterRequest> = {}
): IRegisterRequest {
  // Données par défaut
  const defaultValues: IRegisterRequest = new RegisterRequest({
    UUID: "userID",
    display_name: "display name",
    email: "test@gmail.com",
    phone: "438222999",
    password: "fakePassword",
    role: 1,
    cguAccepted: true,
    hut_name: "Hut Name",
    hut_number: "X72JWGC",
    create_at: new Date(),
    last_update: new Date(),
    postalLocation: "H3S3O1",
  });

  // Surcharge des valeurs par défaut avec celles fournies en paramètre
  return Object.assign(defaultValues, overrideValues);
}
