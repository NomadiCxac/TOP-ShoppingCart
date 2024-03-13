import admin from 'firebase-admin';
import serviceAccount from '../data/serviceAccount.js'

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Fetch user details and log their custom claims
const verifyAdminClaim = async (email) => {
    try {
      const user = await admin.auth().getUserByEmail(email);
      console.log(`Claims for ${email}: `, user.customClaims);
    } catch (error) {
      console.error(`Error fetching user by email (${email}):`, error);
    }
};

// Replace with the email of the user you want to check
verifyAdminClaim('scrdad333@gmail.com');