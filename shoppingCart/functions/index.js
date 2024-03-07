/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendEmail = functions.https.onCall(async (data, context) => {
  // Checking that the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated.",
    );
  }

  const msg = {
    to: data.to, // Recipient email address
    from: "kitchenonselwynrd@gmail.com", // Verified sender email address
    subject: data.subject,
    text: data.text,
    html: data.html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
    return {success: true};
  } catch (error) {
    console.error("SendGrid email not sent:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Unable to send email",
        error,
    );
  }
});
