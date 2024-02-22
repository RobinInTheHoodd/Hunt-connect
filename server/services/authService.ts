import firebase from "../config/firebaseConfig";
import RegisterRequest from "../models/auth/registerRequest";

const register = async (register: RegisterRequest) => {
  try {
    const user = await firebaseRegister(register);

    return user!.customeToken;
  } catch (e) {}
};

const firebaseRegister = async (register: RegisterRequest) => {
  try {
    const userRecord = await firebase.firebaseAuth.createUser({
      displayName: register.name,
      email: register.email,
      emailVerified: false,
      password: register.password,
      phoneNumber: register.phone,
      disabled: false,
    });

    const customeToken = await firebase.firebaseAuth.createCustomToken(
      userRecord.uid
    );

    return { userRecord, customeToken };
  } catch (e) {}
};

export default {
  register,
};
