import admin from 'firebase-admin';
import serviceAccount from '../data/serviceAccount.js';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config(); // Ensure this if you're using .env for environment variables

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendTestEmail() {
    
    const msg = {
        to: "Christianxavier.cordero@gmail.com",
        from: "your-verified-sender-email@example.com",
        subject: "Hello from Firebase and SendGrid!",
        text: "This is a test email to verify Firebase function setup.",
        html: "<strong>This is a test email to verify Firebase function setup.</strong>",
    };

    try {
        await sgMail.send(msg);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

sendTestEmail();