import { useFirebase } from '../context/FirebaseContext';

const SignOutButton = () => {
    const { userSignOut } = useFirebase();

    return (
        <button onClick={userSignOut}>Sign Out</button>
    );
};

export default SignOutButton;