const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const admin = require("firebase-admin");
const {formatName} = require("./helpers/formatName.js");
const {retrieveImageUrl} = require("./helpers/retrieveImageUrl.js");
const https = require("https");

admin.initializeApp();


sgMail.setApiKey(functions.config().sendgrid.key);
const apiKey = functions.config().zerobounce.key;
const db = admin.database();

exports.sendTestEmail = functions.https.onCall(async (data) => {
  console.log("Received data:", data);
  console.log("Order details:", data.orderDetails);
  const email = data.email;
  const orderDetails = data.orderDetails;
  const orderReference = data.orderReference;
  const pageLink = data.pageLink;

  // Process orderDetails to format email content
  const orderItems = orderDetails.map((item) => ({
    id: item.id,
    name: formatName(item.id),
    imageUrl: retrieveImageUrl(item.id),
    dozenQuantity: item.dozenQuantity,
    dozenPrice: item.dozenPrice.toFixed(2),
    halfDozenQuantity: item.halfDozenQuantity,
    halfDozenPrice: item.halfDozenPrice.toFixed(2),
    quantity: item.quantity,
    price: item.price ? item.price.toFixed(2) : null,
    batched: item.batched,
  }));

  // Prepare SendGrid email message
  const msg = {
    to: email,
    from: "kitchenonselwynrd@gmail.com", // Your verified sender
    templateId: "d-d6477f63721f44b6afff0b5b2bebd4e1",
    dynamic_template_data: {
      subject: "Hello from SendGrid",
      name: "Recipient Name", // Modify as needed or extract from data
      orderItems: orderItems,
      orderReference: orderReference,
      pageLink: pageLink,
    },
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
    return {success: true, message: "Email sent successfully"};
  } catch (error) {
    console.error("SendGrid email not sent:", error);
    throw new functions.https.HttpsError("internal", "Unable to send email", error.toString());
  }
});


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

exports.processEmailValidation = functions.https.onCall(async (data) => {
  // Ensure the user is authenticated.
  // if (!context.auth) {
  //   throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
  // }

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
