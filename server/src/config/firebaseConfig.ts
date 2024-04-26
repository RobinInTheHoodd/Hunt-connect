import * as firebaseAdmin from "firebase-admin";

var serviceAccount = require("./firebase-admin-key.json");

export class FirebaseAdminSingleton {
  private static authInstance: firebaseAdmin.auth.Auth;
  private static databaseInstance: firebaseAdmin.database.Database;
  private static firestore: firebaseAdmin.firestore.Firestore;

  private constructor() {}

  private static initializeApp() {
    if (firebaseAdmin.apps.length === 0) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: "https://hunt-connect-default-rtdb.firebaseio.com/",
      });
    }
  }
  public static getFirebaseAuth(): firebaseAdmin.auth.Auth {
    FirebaseAdminSingleton.initializeApp();
    if (!FirebaseAdminSingleton.authInstance) {
      FirebaseAdminSingleton.authInstance = firebaseAdmin.auth();
    }
    return FirebaseAdminSingleton.authInstance;
  }

  public static getFirebaseDatabase(): firebaseAdmin.database.Database {
    FirebaseAdminSingleton.initializeApp();
    if (!FirebaseAdminSingleton.databaseInstance) {
      FirebaseAdminSingleton.databaseInstance = firebaseAdmin.database();
    }
    return FirebaseAdminSingleton.databaseInstance;
  }

  public static getFirebaseFirestore(): firebaseAdmin.firestore.Firestore {
    FirebaseAdminSingleton.initializeApp();
    if (!FirebaseAdminSingleton.firestore) {
      FirebaseAdminSingleton.firestore = firebaseAdmin.firestore();
    }
    return FirebaseAdminSingleton.firestore;
  }
}
