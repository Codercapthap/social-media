import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const admin = require("firebase-admin");

class Middleware {
  async decodeToken(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        res.locals.currentUser = decodeValue;
        return next();
      }
      return res.json({ message: "Unauthorize" });
    } catch (err) {
      return res.json({ message: "Internal Error" });
    }
  }
}

export default new Middleware();
