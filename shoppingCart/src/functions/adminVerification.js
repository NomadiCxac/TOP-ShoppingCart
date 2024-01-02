// Import the JSON data from the file
import adminUsers from './adminUsers.json';

const adminVerification = (user) => {
    // Check if user is not undefined or null
    if (user.email) {
        // Check if the user's email is in the list of admin emails
        const isAdmin = adminUsers.admins.includes(user.email);

        // Return true if the user is an admin, false otherwise
        return isAdmin;
    } else {
        // Return false if user is undefined or null
        return false;
    }
}

export default adminVerification;