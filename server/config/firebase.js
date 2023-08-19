import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");
const serviceAccount = require("/etc/secrets/serviceAccountKey.json");

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const getAuth = admin.auth(app);
