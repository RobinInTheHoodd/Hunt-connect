import { UserRecord } from "firebase-admin/auth";

export declare class IRegisterRequest {
  UUID?: string;
  display_name?: string;
  email: string;
  phone?: string;
  password?: string;
  cguAccepted?: boolean;
  role: number;
  hut_name?: string;
  hut_number?: string;
  create_at?: Date;
  last_update?: Date;
  postalLocation?: string;
}

export default class RegisterRequest implements IRegisterRequest {
  UUID?: string;
  display_name?: string;
  email: string;
  phone?: string;
  password?: string;
  cguAccepted?: boolean;
  role: number;
  hut_name?: string;
  hut_number?: string;
  create_at?: Date;
  last_update?: Date;
  postalLocation?: string;

  constructor({
    UUID,
    display_name,
    email,
    phone,
    password,
    role,
    cguAccepted,
    hut_name,
    hut_number,
    create_at,
    last_update,
    postalLocation,
  }: IRegisterRequest) {
    this.UUID = UUID;
    this.display_name = display_name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
    this.cguAccepted = cguAccepted;
    this.hut_name = hut_name;
    this.hut_number = hut_number;
    this.create_at = create_at;
    this.last_update = last_update;
    this.postalLocation = postalLocation;
  }

  static fromUserContext(userRecord: UserRecord): RegisterRequest {
    return new RegisterRequest({
      UUID: userRecord.uid || "",
      display_name: userRecord.displayName! || "",
      email: userRecord.email! || "",
      phone: userRecord.phoneNumber || "",
      role: 1, // TOD need an update (ask user)
    });
  }
}
