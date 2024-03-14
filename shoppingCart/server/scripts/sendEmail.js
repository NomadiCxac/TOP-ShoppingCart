import processEmailValidation from './processEmailValidation.js';
import admin from 'firebase-admin';
import serviceAccount from '../data/serviceAccount.js';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import formatName from '../../src/functions/formatName.js';
import resolveImageUrl from '../../src/functions/resolveImageUrl.js';
import { checkoutItemTotal } from '../../src/functions/checkoutTotal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../data/sendgrid.env') });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendTestEmail(email, ipAddress, orderDetails, orderReference, pageLink) {

  try {
    // Use the imported function to get the email validation result
    const validationResult = await processEmailValidation(email, ipAddress);
    const orderItems = orderDetails.map(item => ({
      id: item.id,
      name: formatName(item.id), // Assuming `formatName` is a function you have defined
      imageUrl: resolveImageUrl(item.id), // Adjust resolveImageUrl to get the full image URL
      dozenQuantity: item.dozenQuantity,
      dozenPrice: item.dozenPrice.toFixed(2),
      halfDozenQuantity: item.halfDozenQuantity,
      halfDozenPrice: item.halfDozenPrice.toFixed(2),
      quantity: item.quantity,
      price: item.price ? item.price.toFixed(2) : null,
      batched: item.batched,
      total: checkoutItemTotal(item).toFixed(2) // Assuming `checkoutItemTotal` is a function you have defined
    }));
    
    // Check if the email is valid
    if (validationResult && validationResult.status === 'valid') {
      const msg = {
        to: email, // Use the validated email
        from: "kitchenonselwynrd@gmail.com",
        templateId: 'd-d6477f63721f44b6afff0b5b2bebd4e1',
        dynamic_template_data: {
          subject: 'Hello from SendGrid',
          name: validationResult.firstname || 'Recipient Name', // Use data from validation result
          orderItems: orderItems, // This needs to be handled in your SendGrid template
          orderReference: orderReference,
          pageLink: pageLink,
        },
      };

      await sgMail.send(msg);
      console.log("Email sent successfully");
    } else {
      console.log("Email validation failed, not sending email.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example usage (replace with the actual email and IP address)
const testEmail = "Christianxavier.cordero@gmail.com";
// const testIpAddress = "99.110.204.1";
sendTestEmail(testEmail, "").catch(console.error);