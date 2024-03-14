import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { signOutUser } from '../functions/signOutUser'; // Adjust the import path as needed

const SignOutButton = () => {
    const { user, userSignOut } = useFirebase();
    const navigate = useNavigate();

    // This wrapper function is necessary to use the hooks within the component
    const handleSignOutClick = () => {
        signOutUser(user, userSignOut, navigate);
    };

    return (
        <button onClick={handleSignOutClick}>Sign Out</button>
    );
};

export default SignOutButton;