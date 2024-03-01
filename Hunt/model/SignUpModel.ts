import { ISignUpForm } from "./SignUpForm";

export declare interface ISignUpModel {
  UUID?: string;
  display_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role: number;
  hut_name?: string;
  hut_number?: string;
  create_at?: Date;
  last_update?: Date;
}

export class SignUpModel implements ISignUpModel {
  UUID?: string;
  display_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role: number;
  hut_name?: string;
  hut_number?: string;
  create_at?: Date;
  last_update?: Date;

  constructor({
    UUID,
    display_name,
    email,
    phone,
    password,
    role,
    hut_name,
    hut_number,
    create_at,
    last_update,
  }: ISignUpModel) {
    this.UUID = UUID;
    this.display_name = display_name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
    this.hut_name = hut_name;
    this.hut_number = hut_number;
    this.create_at = create_at;
    this.last_update = last_update;
  }

  static fromSignUpForm(signUpForm: ISignUpForm): ISignUpModel {
    return new SignUpModel({
      UUID: signUpForm.UUID,
      display_name: signUpForm.fullName,
      email: signUpForm.email,
      phone: signUpForm.phone,
      role: 1, // TODO need an update (ask user)
      hut_name: signUpForm.hutName || "",
      hut_number: signUpForm.hutNumber || "",
    });
  }
}
