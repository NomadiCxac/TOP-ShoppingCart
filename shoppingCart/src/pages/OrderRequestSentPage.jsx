import { useFirebase } from "../context/FirebaseContext";
import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import resolveImageUrl from "../functions/resolveImageUrl";
import { calculateSubtotal } from "../functions/checkoutTotal";
import formatName from "../functions/formatName";

import './OrderRequestSentPage.css'


function OrderRequestSent() {
    const { cartItems, clearCart } = useCart();
    const { database, isFirebaseReady } = useFirebase();
    const { updateOrderCodeSent, retrieveOrderById } = useFirebaseOrders();
    const [orderData, setOrderData] = useState([]);
    const { orderId } = useParams();
    const navigate = useNavigate(); 

    const [emailButtonState, setEmailButtonState] = useState({ disabled: true, text: 'Reference Code Sent Via Email', className: 'disabledButton' });
    const [telButtonState, setTelButtonState] = useState({ disabled: true, text: 'Send My Code Via Tel.', className: 'disabledButton' });

    
    useEffect(() => {


        console.log("Database from context", database);

        console.log("Did this work")
        const fetchOrderDetails = async () => {
            
            if (!isFirebaseReady) {
                console.log("Firebase services are not ready yet.");
                return;
            }

            const orderDetails = await retrieveOrderById(orderId);
            if (orderDetails) {
                let orderArray = Object.values(orderDetails.items).map(item => ({
                    ...item,
                    imageURL: resolveImageUrl(item.id),
                }));

                setOrderData(orderArray);

                setEmailButtonState(prevState => ({
                    ...prevState,
                    disabled: !(orderDetails.orderCodeSentByEmail === false),
                    className: orderDetails.orderCodeSentByEmail === false ? 'enabledButton' : 'disabledButton',
                    text: orderDetails.orderCodeSentByEmail === false ? 'Send My Code Via Email' : 'Reference Code Sent Via Email'
                }));

                setTelButtonState(prevState => ({
                    ...prevState,
                    disabled: !(orderDetails.orderCodeSentByPhone === false),
                    className: orderDetails.orderCodeSentByPhone === false ? 'enabledButton' : 'disabledButton',
                    text: orderDetails.orderCodeSentByPhone === false ? 'Send My Code Via Tel.' : 'Reference Code Sent Via Tel.'
                }));
            } else {
                console.log("Order details not found for orderId: ", orderId);
            }
        };

        fetchOrderDetails();
    }, [isFirebaseReady]); 

    const handleEmailButtonClick = async () => {
        console.log("Sending code via Email...");
    
        if (!orderId) {
            console.error("No reference Order ID available.");
            return;
        }
    
        try {
            await updateOrderCodeSent(orderId, 'orderCodeSentByEmail', true);
            setEmailButtonState({ disabled: true, text: 'Reference Code Sent Via Email', className: 'disabledButton' });
            alert("Order reference code has been sent via email.");
        } catch (error) {
            console.error("Failed to send email: ", error);
        }

        clearCart()
    };

    // Helper function to calculate the total price of an item
    const checkoutItemTotal = (item) => {
        let total = 0;
        if (item.dozenQuantity) {
            total += item.dozenQuantity * item.dozenPrice;
        }
        if (item.halfDozenQuantity) {
            total += item.halfDozenQuantity * item.halfDozenPrice;
        }
        if (item.quantity && !item.batched) {
            total += item.quantity * item.price;
        }
        return total;
    };


    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + checkoutItemTotal(item), 0);

    const handleOrderManagementClick = () => {
        clearCart(); // Clear the cart
        navigate('/orderManagement'); // Navigate programmatically
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(orderId)
          .then(() => {
            // Optional: Display some feedback to the user that the text was copied.
            alert("Order Reference Code copied to clipboard!");
          })
          .catch(err => {
            // Handle any errors (optional)
            console.error("Error in copying text: ", err);
          });
      };

    return (
        <div>

                    
            <div className="nextStepsContainer"> 
                <div className="nextStepTitle">Next Steps to Complete Your Order: </div>
                <div className="clientStep"> (1.) <Link to={`/orderManagement/${orderId}`}> <span className="signInButton">Sign in</span></Link> to the order management page with your reference code or email used with the order. </div>
                <div className="clientStep"> (2.) Complete payment. </div> 
                <div className="clientStep"> (3.) Select a valid pick up date.</div>
            </div>

                
            <div className="orderItemsContainer" id="orderRequestSent">
                <div className="orderRequestSummaryTitle">Order Request Summary:</div>
                <div className="orderReviewContainer" id='orderRequestSent'>
                    {orderData.map((item) => (
                        <div className='orderItemContainer' id='orderRequestSent' key={item.id + "-orderReview"}>
                            <div className='orderItemContents' id='left'>
                                <img className="orderIcon" key={item.id} src={resolveImageUrl(item.id)} alt={formatName(item.id)} />
                                <div className='orderItemDescription' id='left'>
                                    <div className='nameOfItem'>
                                        {formatName(item.id)}
                                    </div>
                                    {item.dozenQuantity > 0 && (
                                        <div className='itemBreakdown' id='dozen'>
                                            {`Dozen ${formatName(item.id)} @ ${item.dozenQuantity} x ${item.dozenPrice.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                    {item.halfDozenQuantity > 0 && (
                                        <div className='itemBreakdown' id='halfDozen'>
                                            {`Half a Dozen ${formatName(item.id)} @ ${item.halfDozenQuantity} x ${item.halfDozenPrice.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                    {item.quantity > 0 && !item.batched && (
                                        <div className='itemBreakdown' id='singular'>
                                            {`${formatName(item.id)} @ ${item.quantity} x ${item.price.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='orderItemContents' id='right'>
                                {checkoutItemTotal(item).toFixed(2) + " CAD"}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="orderSubtotal" id='orderRequestSent'>
                    {`Total: ${calculateSubtotal(orderData).toFixed(2)} CAD`} 
                </div>

            {/* OrderItemsContainer ending div */}
            </div>


            <div className="orderCodeContainer">

                <div className="referenceNumberContainer">
                    This is Your Order Reference Code: {orderId}
                    <button id="clipboard" onClick={copyToClipboard} className="material-symbols-outlined"><span className="material-symbols-outlined">content_copy</span></button>
                </div>

                <div className="sendCodeContainer">
                    {/* Send Code Via Email Button */}
                    <button 
                    className="sendRefCodeButton"
                    onClick={handleEmailButtonClick} 
                    disabled={emailButtonState.disabled} 
                    id={emailButtonState.className}
                    >
                    {emailButtonState.text}
                    </button>

                    {/* Send Code Via Phone Button */}
                    {/* <button 
                    className="sendRefCodeButton"
                    onClick={handleTelButtonClick} 
                    disabled={telButtonState.disabled} 
                    id={telButtonState.className}
                    >
                    {telButtonState.text}
                    </button>  */}
                </div>
            </div>

    {/* Parent jsx end div */}
    </div>
    );
}

export default OrderRequestSent;