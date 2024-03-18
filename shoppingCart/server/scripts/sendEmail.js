import admin from 'firebase-admin';
import serviceAccount from '../data/serviceAccount.js';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import formatName from '../../src/functions/formatName.js';
import resolveImageUrl from '../../src/functions/resolveImageUrl.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../data/sendgrid.env') });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendTestEmail(email, orderDetails, orderReference, pageLink) {
  try {
      const orderItems = orderDetails.map(item => ({
          id: item.id,
          name: formatName(item.id),
          imageUrl: resolveImageUrl(item.id),
          dozenQuantity: item.dozenQuantity,
          dozenPrice: item.dozenPrice.toFixed(2),
          halfDozenQuantity: item.halfDozenQuantity,
          halfDozenPrice: item.halfDozenPrice.toFixed(2),
          quantity: item.quantity,
          price: item.price ? item.price.toFixed(2) : null,
          batched: item.batched,
      }));

      const msg = {
          to: email,
          from: "kitchenonselwynrd@gmail.com",
          templateId: 'd-d6477f63721f44b6afff0b5b2bebd4e1',
          dynamic_template_data: {
              subject: 'Hello from SendGrid',
              name: 'Recipient Name', // Modify as needed
              orderItems: orderItems,
              orderReference: orderReference,
              pageLink: pageLink,
          },
      };

      await sgMail.send(msg);
      console.log("Email sent successfully");
  } catch (error) {
      console.error("Error:", error);
  }
}

export default sendTestEmail

async function testSendEmail() {
    const testOrderDetails = [
        {
            id: "chocolateCrinkleCookies",
            batched: true,
            dozenPrice: 15,
            dozenQuantity: 1,
            halfDozenPrice: 10,
            halfDozenQuantity: 1,
            quantity: 0,
            imageURL: "https://firebasestorage.googleapis.com/v0/b/kitchen-on-selwyn-rd.appspot.com/o/food%20menu%20icons%2FdefaultFood.jpeg?alt=media&token=9f76128c-2ba3-4bb7-87eb-c38f58ed7eeb"
        },
        {
            id: "ensaymada",
            batched: true,
            dozenPrice: 40,
            dozenQuantity: 1,
            halfDozenPrice: 22,
            halfDozenQuantity: 1,
            quantity: 0,
            imageURL: "https://firebasestorage.googleapis.com/v0/b/kitchen-on-selwyn-rd.appspot.com/o/food%20menu%20icons%2FdefaultFood.jpeg?alt=media&token=9f76128c-2ba3-4bb7-87eb-c38f58ed7eeb"
        }
    ];

    const testEmail = "christianxavier.cordero@gmail.com"; // This is the email where you're sending the test email
    const testOrderReference = "12345ABC"; // Example order reference, replace with actual if needed
    const testPageLink = "https://kitchenonselwynroad.com/orderManagement";

    await sendTestEmail(testEmail, testOrderDetails, testOrderReference, testPageLink);
}

testSendEmail().catch(console.error);

// Example usage (replace with the actual email and IP address)
// const testEmail = "Christianxavier.cordero@gmail.com";
// const testIpAddress = "99.110.204.1";
