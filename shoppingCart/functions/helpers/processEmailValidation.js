const functions = require("firebase-functions");
const admin = require("firebase-admin");
const https = require("https");

const apiKey = functions.config().zerobounce.key;
const db = admin.database();

const checkValidatedEmail = async (email) => {
  const sanitizedEmail = email.replace(/\./g, ",");
  const emailRef = db.ref(`validatedEmails/${sanitizedEmail}`);
  const snapshot = await emailRef.once("value");
  return snapshot.exists();
};

const validateEmail = async (email, ipAddress = "") => {
  return new Promise((resolve, reject) => {
    const url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}&ip_address=${ipAddress}`;
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          console.error("Error parsing JSON:", error);
          reject(new Error("Error parsing JSON"));
        }
      });
    }).on("error", (err) => {
      console.error("Error in validateEmail:", err);
      reject(new Error("Error in validateEmail"));
    });
  });
};

const storeValidatedEmail = async (email) => {
  const sanitizedEmail = email.replace(/\./g, ",");
  await db.ref(`validatedEmails/${sanitizedEmail}`).set({
    email: email,
    validatedAt: admin.database.ServerValue.TIMESTAMP,
  });
};

exports.processEmailValidation = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const {email, ipAddress} = data;
  const isEmailValidated = await checkValidatedEmail(email);

  if (isEmailValidated) {
    return {status: "valid", email: email};
  } else {
    const validationResult = await validateEmail(email, ipAddress);
    if (validationResult && validationResult.status === "valid") {
      await storeValidatedEmail(email);
      return {status: "valid", email: email};
    } else {
      throw new functions.https.HttpsError("failed-precondition", "Validation failed or email is not valid");
    }
  }
});
