import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css';
import { getFirebaseUIConfig, getFirebaseUIInstance } from '../functions/firebaseUIConfig';
import { useFirebase } from '../context/FirebaseContext';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import './OrderManagement.css';

const OrderManagement = () => {
    const { user, auth, signInAnonymously, anonymousOrderId, setAnonymousOrder, referenceOrderId } = useFirebase();
    const navigate = useNavigate();
    // Set orderId to referenceOrderId if it exists, otherwise initialize it as null.
    const [orderId, setOrderId] = useState(referenceOrderId || '');

    const { retrieveOrderById } = useFirebaseOrders();

    useEffect(() => {
        console.log(anonymousOrderId);
        console.log(user);
        console.log(orderId);
    }, []);

    const handleAnonymousAccessSubmit = async (e) => {
        e.preventDefault();

        console.log(orderId === "");

        const anonOrder = await retrieveOrderById(orderId);
        if (anonOrder) {
            // Assuming setAnonymousOrder stores the order for later use
            if (!user) {
                await signInAnonymously(orderId);
                setAnonymousOrder([anonOrder]);
            }
            // Assuming there's a way to navigate or access the order directly here
        } else {
            console.error("Order does not exist.");
        }
    };

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
            navigate('/userDashboard');
            console.log("User is already logged in");
        }
    }, [user, auth]);

    return (
        <div className="login-page-container">
            {!user && (
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
                                    placeholder='Input Order ID Here'
                                    value={orderId} 
                                    onChange={(e) => setOrderId(e.target.value)} 
                                    required />
                                <button type="submit">Access Order</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}  
        </div>
    );
};

export default OrderManagement;