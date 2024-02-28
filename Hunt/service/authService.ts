import axios from "axios";

export const authService = {
  async userRegisterFirebase(regiser: ISignUpModel) {
    await axios.post("http://10.0.0.228:3000/auth/registerFirebase", regiser);
  },

  async userRegister(regiser: ISignUpModel) {
    await axios.post("http://10.0.0.228:3000/auth/register", regiser);
  },
};
