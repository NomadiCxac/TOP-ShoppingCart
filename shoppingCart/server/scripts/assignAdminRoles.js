import admin from 'firebase-admin';
import serviceAccount from '../data/serviceAccount.js';
import adminUsers from '../data/adminUsers.js';


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to assign admin role
const assignAdminRoles = async () => {
  for (const email of adminUsers) {
    try {
      // Fetch the user by email
      const user = await admin.auth().getUserByEmail(email);

      // Set custom user claims
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      console.log(`Admin role assigned to ${email}`);
    } catch (error) {
      console.error(`Error assigning admin role to ${email}:`, error);
    }
  }
};

assignAdminRoles();