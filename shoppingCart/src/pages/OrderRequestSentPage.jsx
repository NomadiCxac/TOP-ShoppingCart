import { useFirebase } from "../context/FirebaseContext";
import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import resolveImageUrl from "../functions/resolveImageUrl";

import './OrderRequestSentPage.css'
import { update } from "firebase/database";

function OrderRequestSent() {
    const { cartItems, clearCart } = useCart();
    const { referenceOrderId } = useFirebase();
    const { updateOrderCodeSent, retrieveOrderById } = useFirebaseOrders();
    const { orderId } = useParams();
    const navigate = useNavigate(); 

    const [emailButtonState, setEmailButtonState] = useState({ disabled: true, text: 'Reference Code Sent Via Email', className: 'disabledButton' });
    const [telButtonState, setTelButtonState] = useState({ disabled: true, text: 'Send My Code Via Tel.', className: 'disabledButton' });

    console.log(orderId)
    useEffect(() => {
        const fetchOrderDetails = async () => {
            // Assuming referenceOrderId is available and valid
            if (!referenceOrderId) {
                return;
            }
    
            const orderDetails = await retrieveOrderById(referenceOrderId);
            if (orderDetails) {
                console.log([orderDetails.items])
                console.log(cartItems)
                // Enable the email button only if orderCodeSentByEmail is explicitly false
                setEmailButtonState(prevState => ({
                    ...prevState,
                    disabled: !(orderDetails.orderCodeSentByEmail === false),
                    className: orderDetails.orderCodeSentByEmail === false ? 'enabledButton' : 'disabledButton',
                    text: orderDetails.orderCodeSentByEmail === false ? 'Send My Code Via Email' : 'Reference Code Sent Via Email'
                }));
    
                // Enable the telephone button only if orderCodeSentByPhone is explicitly false
                setTelButtonState(prevState => ({
                    ...prevState,
                    disabled: !(orderDetails.orderCodeSentByPhone === false),
                    className: orderDetails.orderCodeSentByPhone === false ? 'enabledButton' : 'disabledButton',
                    text: orderDetails.orderCodeSentByPhone === false ? 'Send My Code Via Tel.' : 'Reference Code Sent Via Tel.'
                }));
            } else {
                console.log("Order details not found.");
            }
        };
    
        fetchOrderDetails();
    }, [referenceOrderId]); 

    const handleEmailButtonClick = async () => {
        console.log("Sending code via Email...");
    
        if (!referenceOrderId) {
            console.error("No reference Order ID available.");
            return;
        }
    
        try {
            await updateOrderCodeSent(referenceOrderId, 'orderCodeSentByEmail', true);
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
        navigator.clipboard.writeText(referenceOrderId)
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
                    <div className="clientStep"> (1.) <Link> <span className="signInButton">Sign in</span></Link> to the order management page with your reference code or email used with the order. </div>
                    <div className="clientStep"> (2.) Complete payment. </div> 
                    <div className="clientStep"> (3.) Select a valid pick up date.</div>
                </div>

                
            <div className="orderItemsContainer" id="orderRequestSent">
                <div className="orderRequestSummaryTitle">Order Request Summary:</div>
                <div className="orderReviewContainer" id='orderRequestSent'>
                    {cartItems.map((item) => (
                        <div className='orderItemContainer' id='orderRequestSent' key={item.id + "-orderReview"}>
                            <div className='orderItemContents' id='left'>
                                <img className="orderIcon" key={item.id} src={resolveImageUrl(item.id)} alt={item.name} />
                                <div className='orderItemDescription' id='left'>
                                    <div className='nameOfItem'>
                                        {item.name}
                                    </div>
                                    {item.dozenQuantity > 0 && (
                                        <div className='itemBreakdown' id='dozen'>
                                            {`Dozen ${item.name} @ ${item.dozenQuantity} x ${item.dozenPrice.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                    {item.halfDozenQuantity > 0 && (
                                        <div className='itemBreakdown' id='halfDozen'>
                                            {`Half a Dozen ${item.name} @ ${item.halfDozenQuantity} x ${item.halfDozenPrice.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                    {item.quantity > 0 && !item.batched && (
                                        <div className='itemBreakdown' id='singular'>
                                            {`${item.name} @ ${item.quantity} x ${item.price.toFixed(2)} CAD`}
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
                    {`Total: ${subtotal.toFixed(2)} CAD`} 
                </div>

            {/* OrderItemsContainer ending div */}
            </div>


            <div className="orderCodeContainer">

                <div className="referenceNumberContainer">
                    This is Your Order Reference Code: {referenceOrderId}
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