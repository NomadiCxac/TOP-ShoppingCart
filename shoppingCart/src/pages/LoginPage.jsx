import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css';
import { getFirebaseUIConfig, getFirebaseUIInstance } from '../functions/firebaseUIConfig';
import { useFirebase } from '../context/FirebaseContext';
import SignOutButton from '../components/SignOutButton';
import './LoginPage.css'
// import UserDashboard from '../components/UserDashboard';

const LoginPage = () => {
    const { user, auth } = useFirebase();
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');

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

    
    const handleAnonymousAccessSubmit = (e) => {
        e.preventDefault();
        // Here you would handle the anonymous access logic
        console.log("Order ID:", orderId, "Email:", email);
        // Navigate or fetch data based on Order ID and Email
    };

    return (
        <div className="login-page-container">
                {!user ? (
                <div className="login-options-container">

                    <div className='accessContainer'>
                    <div className="login-container">
                    <h2>Access Your Orders Via: Login</h2>
                        <h2>Login</h2>
                        <div id="firebaseui-auth-container"></div>
                    </div>

                    <div className="or-divider">- OR -</div>
                    
                    <div className="anonymous-access-container">
                    <h2>Access Your Orders Via: ID and Email</h2>
                        <h2>Enter Order ID and Email</h2>
                        <form onSubmit={handleAnonymousAccessSubmit}>
                            <input 
                                type="text" 
                                placeholder="Order ID" 
                                value={orderId} 
                                onChange={(e) => setOrderId(e.target.value)} 
                                required />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required />
                            <button type="submit">Access Order</button>
                        </form>
                    </div>
                </div>
                    </div>

            )  : (
                <div className='loggedIn-container'>
                    <div className='user-details-container'>
                        <div className="user-info-container">
                            <h2>Hello, {user.displayName}!</h2>
                            <h3> You are currently logged in as {user.email}</h3>
                        </div>

                        <div className="sign-out-container">
                            {/* classname is signoutButton */}
                            <SignOutButton /> 
                        </div>
                    </div>


                    <div className="orders-outlet-container">
                        <div className='order-list-title'>
                            <h3>Your Outstanding Order(s) - If your orders are not appearing, please refersh this page</h3>
                        </div>

                        <Outlet /> {/* This will render nested routes such as UserDashboard */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;