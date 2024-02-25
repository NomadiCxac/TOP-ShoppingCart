import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useFirebase } from '../context/FirebaseContext';

const SignOutButton = () => {
    const { userSignOut } = useFirebase();
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSignOut = async () => {
        await userSignOut(); // Wait for the sign-out process to complete
        if (localStorage.getItem('anonymousOrderId')) {
            localStorage.removeItem('anonymousOrderId');
        }

        navigate('/orderManagement'); // Redirect to the login page
    };

    return (
        <button className='signoutButton' onClick={handleSignOut}>Sign Out</button>
    );
};

export default SignOutButton;