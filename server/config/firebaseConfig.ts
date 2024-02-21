import * as firebaseAdmin from "firebase-admin";

var serviceAccount = require("./firebase-admin-key.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const firebaseAuth = firebaseAdmin.auth();

export default { firebaseAuth };
