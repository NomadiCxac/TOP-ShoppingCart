const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const admin = require("firebase-admin");
const formatName = require("./helpers/formatName.js");
const retrieveImageUrl = require("./helpers/retrieveImageUrl.js");

admin.initializeApp();

// Assuming you"ve set the SendGrid API key as an environment variable
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendTestEmail = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError("failed-precondition", "The function must be called while authenticated.");
  }

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
