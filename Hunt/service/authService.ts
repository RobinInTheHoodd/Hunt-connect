import axios from "axios";
import { ISignUpModel } from "../model/SignUpModel";

export const authService = {
  async userRegister(regiser: ISignUpModel) {
    await axios.post("http://10.0.0.228:3000/auth/register", regiser);
  },
};
