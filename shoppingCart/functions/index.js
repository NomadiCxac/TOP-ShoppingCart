const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const admin = require("firebase-admin");
const {formatName} = require("./helpers/formatName.js");
const {retrieveImageUrl} = require("./helpers/retrieveImageUrl.js");
const https = require("https");

admin.initializeApp();

const adminEmails = [
  "kitchenonselwynrd@gmail.com",
  "christianxavier.cordero@gmail.com",
  "scrdad333@gmail.com",
];

exports.assignAdminRoles = functions.https.onCall(async (data, context) => {
  // Ensure the function is called by an authenticated admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError("permission-denied", "Only admins can invoke this function.");
  }

  const errors = [];
  const successes = [];

  for (const email of adminEmails) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, {admin: true});
      successes.push(`Admin role assigned to ${email}`);
    } catch (error) {
      console.error(`Error assigning admin role to ${email}:`, error);
      errors.push(`Error assigning admin role to ${email}: ${error.message}`);
    }
  }

  return {
    successes,
    errors,
  };
});


sgMail.setApiKey(functions.config().sendgrid.key);
const apiKey = functions.config().zerobounce.key;
const db = admin.database();

exports.sendOrderReviewEmail = functions.https.onCall(async (data) => {
  const email = data.email;
  const orderItemsArray = Object.values(data.orderDetails);
  const orderReference = data.orderReference;
  const pageLink = data.pageLink;
  const subtotal = data.subtotal;

  // Process orderDetails to format email content
  const orderItems = orderItemsArray.map((item) => ({
    id: item.id,
    name: formatName(item.id),
    imageUrl: retrieveImageUrl(item.id),
    dozenQuantity: item.dozenQuantity != null ? item.dozenQuantity : 0,
    dozenPrice: typeof item.dozenPrice === "number" ? item.dozenPrice.toFixed(2) : "0.00",
    halfDozenQuantity: item.halfDozenQuantity != null ? item.halfDozenQuantity : 0,
    halfDozenPrice: typeof item.halfDozenPrice === "number" ? item.halfDozenPrice.toFixed(2) : "0.00",
    quantity: item.quantity != null ? item.quantity : 0,
    price: typeof item.price === "number" ? item.price.toFixed(2) : "0.00",
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
      subtotal: subtotal,
      orderReference: orderReference,
      pageLink: pageLink,
    },
  };


  try {
    await sgMail.send(msg);
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
