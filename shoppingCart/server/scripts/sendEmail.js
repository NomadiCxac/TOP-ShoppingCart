import processEmailValidation from './processEmailValidation.js';
import admin from 'firebase-admin';
import serviceAccount from '../data/serviceAccount.js';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../data/sendgrid.env') });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendTestEmail(email, ipAddress) {
  try {
    // Use the imported function to get the email validation result
    const validationResult = await processEmailValidation(email, ipAddress);
    
    // Check if the email is valid
    if (validationResult && validationResult.status === 'valid') {
      const msg = {
        to: email, // Use the validated email
        from: "kitchenonselwynrd@gmail.com",
        templateId: 'd-d6477f63721f44b6afff0b5b2bebd4e1',
        dynamic_template_data: {
          subject: 'Hello from SendGrid',
          name: validationResult.firstname || 'Recipient Name', // Use data from validation result
          otherVariable: 'Other Value',
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