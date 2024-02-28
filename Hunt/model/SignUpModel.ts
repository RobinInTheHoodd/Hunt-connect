interface ISignUpModel {
  UUID?: string;
  display_name: string;
  email: string;
  phone: string;
  password?: string;
  role: number;
  hut_name?: string;
  hut_number?: string;
  create_at?: Date;
  last_update?: Date;
}
