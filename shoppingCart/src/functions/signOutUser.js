export const signOutUser = async (user, userSignOut, navigate) => {

    if (localStorage.getItem('anonymousOrderId')) {
        localStorage.removeItem('anonymousOrderId');
    }

    if (user) {
        if (user.isAnonymous) {
            // If the user is anonymous, delete the user before signing out
            try {
                await user.delete();
            } catch (error) {
                console.error('Error deleting anonymous user:', error);
            }
        }

        // For non-anonymous users or after deleting an anonymous user, call the sign out function
        try {
            await userSignOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    // Execute navigation after sign out
    navigate('/orderManagement');
};