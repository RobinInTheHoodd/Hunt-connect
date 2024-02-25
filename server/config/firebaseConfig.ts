import * as firebaseAdmin from "firebase-admin";

var serviceAccount = require("./firebase-admin-key.json");

export class FirebaseAdminSingleton {
  private static instance: firebaseAdmin.auth.Auth;

  private constructor() {}

  public static getFirebaseAuth(): firebaseAdmin.auth.Auth {
    if (!FirebaseAdminSingleton.instance) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
      });

      FirebaseAdminSingleton.instance = firebaseAdmin.auth();
    }

    return FirebaseAdminSingleton.instance;
  }
}
