import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css';
import { getFirebaseUIConfig, getFirebaseUIInstance } from '../functions/firebaseUIConfig';
import { useFirebase } from '../context/FirebaseContext';
import SignOutButton from '../components/SignOutButton';
import './LoginPage.css'
// import UserDashboard from '../components/UserDashboard';

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
        <div className="login-page-container">
            {!user ? (
                <>
                    <h1>Login Page</h1>
                    <div id="firebaseui-auth-container"></div>
                </>
            ) : (
                <div className='loggedIn-container'>
                    <div className='user-details-container'>
                        <div className="user-info-container">
                            <h2>Hello, {user.displayName}!</h2>
                            <h3> You are currently logged in as {user.email}</h3>
                        </div>

                        <div className="sign-out-container">
                            <SignOutButton />
                        </div>
                    </div>


                    <div className="orders-outlet-container">
                        <div className='order-list-title'>
                            <h3>Your Outstanding Order(s)</h3>
                        </div>

                        <Outlet /> {/* This will render nested routes such as UserDashboard */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;