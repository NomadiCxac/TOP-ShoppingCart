import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css';
import { getFirebaseUIConfig, getFirebaseUIInstance } from '../functions/firebaseUIConfig';
import { useFirebase } from '../context/FirebaseContext';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import './OrderManagement.css'
// import UserDashboard from '../components/UserDashboard';

const OrderManagement = () => {
    const { user, auth, signInAnonymously, anonymousOrderId, setAnonymousOrder } = useFirebase();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState('');
    const [orderExists, setOrderExists] = useState(false)
    const { retrieveOrderById } = useFirebaseOrders()

    useEffect(() => {
        console.log(anonymousOrderId)
    }, []);

    const handleAnonymousAccessSubmit = async (e) => {
        e.preventDefault();
    
        // Use retrieveOrdersFromDatabase to check if the order exists
        let anonOrder = await retrieveOrderById(orderId); // Assuming false for isAdmin since this is anonymous access
    
        if (anonOrder) {
            // Order exists
            setOrderExists(true);
            setAnonymousOrder(anonOrder); // Adjust based on your actual data structure

    
            // Only sign in anonymously if the user is not already signed in
            if (!user) {
                await signInAnonymously(orderId);
                navigate('/userDashboard'); // Update this path based on your routing setup
            }
        } else {
            // Handle the case where the order does not exist
            console.error("Order does not exist.");
            setOrderExists(false);
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
            navigate('/userDashboard')
            console.log("User is already logged in");
        }

        return;
    }, [user, auth]);

    // useEffect(() => {
    //     if (user || user.isAnonymous) { // Check if the user is logged in and not anonymous
    //         navigate('/userDashboard'); // Navigate to the dashboard
    //     }
    // }, [user, navigate]); // Depend on user and navigate to re-run the effect if either changes

    


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
                                placeholder="Order ID" 
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