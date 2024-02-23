import firebase from "../config/firebaseConfig";
import RegisterRequest from "../models/auth/registerRequest";
import pool from "../db/pgPool";
import userDataAccess from "../repository/userDataAccess";

const register = async (register: RegisterRequest) => {
  try {
    //    const user = await firebaseRegister(register);
    register.UUID = "dffdsfds";
    userDataAccess.createUser(register);

    return "BONJOUR";
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const firebaseRegister = async (register: RegisterRequest) => {
  try {
    const userRecord = await firebase.firebaseAuth.createUser({
      displayName: register.display_name,
      email: register.email,
      emailVerified: false,
      password: register.password,
      phoneNumber: register.phone,
      disabled: false,
    });

    register.UUID = userRecord.uid;

    const customeToken = await firebase.firebaseAuth.createCustomToken(
      userRecord.uid
    );

    return { register, customeToken };
  } catch (e) {
    console.log(e);
  }
};

export default {
  register,
};
