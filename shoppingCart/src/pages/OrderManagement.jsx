import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css';
import { getFirebaseUIConfig, getFirebaseUIInstance } from '../functions/firebaseUIConfig';
import { useFirebase } from '../context/FirebaseContext';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import './OrderManagement.css'
// import UserDashboard from '../components/UserDashboard';

const OrderManagement = () => {
    const { user, auth, signInAnonymously, anonymousOrderId, setAnonymousOrder, referenceOrderId } = useFirebase();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState('');
    const { retrieveOrderById } = useFirebaseOrders()

    useEffect(() => {
        console.log(anonymousOrderId)
        console.log(user)
    }, []);


    const handleAnonymousAccessSubmit = async (e) => {
        e.preventDefault();

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
            navigate('/userDashboard')
            console.log("User is already logged in");
        }

        return;
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
                                placeholder={referenceOrderId ? referenceOrderId : 'Input Order ID Here'}
                                value={referenceOrderId ? referenceOrderId : orderId} 
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