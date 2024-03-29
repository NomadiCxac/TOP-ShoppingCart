import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css';
import { getFirebaseUIConfig, getFirebaseUIInstance } from '../functions/firebaseUIConfig';
import { useFirebase } from '../context/FirebaseContext';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import './OrderManagement.css';

const OrderManagement = () => {
    const { user, auth, signInAnonymously, setAnonymousOrder } = useFirebase();
    const navigate = useNavigate();
    const { orderId } = useParams();
    // Set orderId to referenceOrderId if it exists, otherwise initialize it as null.
    const [inputValue, setInputValue] = useState(orderId || '');
    const { retrieveOrderById } = useFirebaseOrders();

    useEffect(() => {
        document.title = 'KSR - Login to View Orders';
      }, []);
    
      
        


    const handleAnonymousAccessSubmit = async (e) => {
        e.preventDefault();
        const orderToAccess = inputValue; // Use inputValue to get the order ID.

        const anonOrder = await retrieveOrderById(orderToAccess);
        if (anonOrder) {
            // Assuming setAnonymousOrder stores the order for later use
            localStorage.setItem('anonymousOrderId', orderToAccess);
            if (!user) {
                await signInAnonymously(orderToAccess);
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
                <div className="login-modal">
                    <h2 className='googleHeader'>View Order with Google Email Auth</h2>
                    <div className="auth-options">
                        <div id="firebaseui-auth-container"></div>
                        <div className="or-divider">or</div>
                        <form onSubmit={handleAnonymousAccessSubmit} className="order-id-form">
                        <h2>View Order with Reference Code</h2>
                            <input 
                                type="text"
                                className='anonymousAccessInteraction' 
                                placeholder='Enter Order Code'
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)}
                                readOnly={!!orderId} // Make input read-only if orderId is present in the URL
                                required />
                            <button type="submit" className='anonymousAccessInteraction'>View Order</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;