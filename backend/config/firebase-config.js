import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
const serviceAccount = JSON.parse(fs.readFileSync("./firebaseAdmin.json"));

const app = initializeApp({
  	credential: cert(serviceAccount)
});

const auth = getAuth(app);
export { auth };