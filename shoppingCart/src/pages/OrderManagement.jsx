import { useEffect, useState } from 'react';
import useShoppingCart from '../hooks/useShoppingCart';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css';
import { getFirebaseUIConfig, getFirebaseUIInstance } from '../functions/firebaseUIConfig';
import { useFirebase } from '../context/FirebaseContext';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import './OrderManagement.css';
import OrderConfirmationOrderSummary from '../components/OrderConfirmationOrderSummary';
import OrderConfirmationText from '../components/OrderConfirmationText';

const OrderManagement = () => {
    const { user, auth, signInAnonymously, setAnonymousOrder } = useFirebase();
    const { orderId } = useParams();
    const { cartEmail } = useShoppingCart();
    const [inputValue, setInputValue] = useState(orderId || '');
    const { retrieveOrderById } = useFirebaseOrders();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const reviewPage = searchParams.get('reviewPage') === 'true'; // This will be true, false, or null

    useEffect(() => {
        document.title = 'KSR - Login to View Orders';
      }, []);


    const handleAnonymousAccessSubmit = async (e) => {
        e.preventDefault();
        const orderToAccess = orderId || inputValue; // Use inputValue to get the order ID.

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
            return;
        }

        const ui = getFirebaseUIInstance(auth);
        const uiConfig = getFirebaseUIConfig(auth);

        if (!user) {
            ui.start('#firebaseui-auth-container', uiConfig);
        } else {
            navigate('/userDashboard');
        }
    }, [user, auth, navigate]);

    return (
        <div className='login-page-content'>

        {!user && !orderId && !reviewPage && (
            <div className="login-page-container" id='standard'>
                {!user && (
                <div className="login-modal" id='standard'>
                    <div className='googleAuth'>
                    <h2 className='googleHeader'>View Order Details</h2>
                    <div className='refCodeAuth'>
                    <form onSubmit={handleAnonymousAccessSubmit} className="order-id-form">
                        <input
                        type="text"
                        className='anonymousAccessInteraction'
                        placeholder='Reference code'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        readOnly={!!orderId} // Make input read-only if orderId is present in the URL
                        required />
                        <button type="submit" className='anonymousAccessInteraction'>View Order</button>
                    </form>
                    </div>
                    </div>

                    <div className="or-divider" id='standard'>or</div>
                    <div id="firebaseui-auth-container"></div>
                    
                </div>
                )}
            </div>
            )}

      
          {!user && orderId && !reviewPage && (
            <div className="login-page-container" id='standard'>
              {!user && (
                <div className="login-modal" id='standard'>
                  <div className='googleAuth'>
                    <h2 className='googleHeader'>View Order Details</h2>
                    <div className='refCodeAuth'>
                    <form onSubmit={handleAnonymousAccessSubmit} className="order-id-form">
                      <input
                        type="text"
                        className='anonymousAccessInteraction'
                        placeholder='Reference code'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        readOnly={!!orderId} // Make input read-only if orderId is present in the URL
                        required />
                      <button type="submit" className='anonymousAccessInteraction'>Sign in with Code</button>
                    </form>
                  </div>
                  </div>
                  <div className="or-divider" id='standard'>or</div>
                  <div id="firebaseui-auth-container"></div> 
      
                  
                </div>
              )}
            </div>
          )}
      
          {!user && orderId && reviewPage && (
            <div className='login-page-content-left'>
              <div className='login-page-order-summary-text'>
                <OrderConfirmationText 
                    orderId={orderId}
                />
              </div>
      
              <div className="login-page-container">
                {!user && (
                  <div className="login-modal" id='confirmation'>
                    <div className='googleAuth'>
                      <h2 className='googleHeader'>View Order</h2>
                      <div className='refCodeAuth'>
                        <form onSubmit={handleAnonymousAccessSubmit} className="order-id-form">
                          {/* Commented out input field for order code as it seems to be not required here anymore. */}
                          <button type="submit" className='anonymousAccessInteraction'>Sign in with Order Code</button>
                        </form>
                      </div>
                    </div>
      
                    <div className="or-divider">or</div>
                    <div id="firebaseui-auth-container"></div>
      
                  </div>
                )}
              </div>
            </div>
          )}
      
          {orderId && reviewPage && (
            <div className='login-page-content-right'>
              <OrderConfirmationOrderSummary />
            </div>
          )}
      
        </div>
      );
}

export default OrderManagement;