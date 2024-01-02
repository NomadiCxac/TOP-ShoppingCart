import { useEffect } from 'react';
import 'firebaseui/dist/firebaseui.css';
import { getFirebaseUIConfig, getFirebaseUIInstance } from '../functions/firebaseUIConfig';
import { useFirebase } from '../context/FirebaseContext';
import SignOutButton from '../components/SignOutButton';

const LoginPage = () => {
    const { user, auth } = useFirebase();

    useEffect(() => {
        if (!auth) {
            console.log("Auth not initialized.");
            return;
        }

        const ui = getFirebaseUIInstance(auth);
        const uiConfig = getFirebaseUIConfig(auth);

        if (!user) {
            ui.start('#firebaseui-auth-container', uiConfig);
        } else {
            console.log("User is already logged in");
        }

        return;
    }, [user, auth]);

    return (
        <div>
            {!user ? (
                <>
                    <h1>Login Page</h1>
                    <div id="firebaseui-auth-container"></div>
                </>
            ) : (
                <>
                    <h1>You are already logged in as {user.displayName}.</h1>
                    <SignOutButton/>
                </>
            )}
        </div>
    );
};

export default LoginPage;