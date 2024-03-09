import { useFirebase } from "../context/FirebaseContext";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useCart } from "../context/CartContext";
// import { Link } from 'react-router-dom';
import resolveImageUrl from "../functions/resolveImageUrl";

import './OrderRequestSentPage.css'

function OrderRequestSent() {
    const { cartItems, clearCart } = useCart();
    const { referenceOrderId } = useFirebase();
    const navigate = useNavigate(); 

    const [emailButtonState, setEmailButtonState] = useState({ disabled: false, text: 'Send My Code Via Email', className: 'enabledButton' });
    const [telButtonState, setTelButtonState] = useState({ disabled: false, text: 'Send My Code Via Tel.', className: 'enabledButton' });
    let adminEmail = "kitchenonselwynrd@gmail.com"

    const handleEmailButtonClick = () => {
        // Logic to send the code via email
        console.log("Sending code via Email...");
    
        // Update the state to disable the button and change the text and class
        setEmailButtonState({ disabled: true, text: 'Reference Code Sent Via Email', className: 'disabledButton' });
      };
    
      const handleTelButtonClick = () => {
        // Logic to send the code via telephone
        console.log("Sending code via Telephone...");
    
        // Update the state to disable the button and change the text and class
        setTelButtonState({ disabled: true, text: 'Reference Code Sent Via Tel.', className: 'disabledButton' });
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

    console.log(cartItems)

    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + checkoutItemTotal(item), 0);

    const handleOrderManagementClick = () => {
        clearCart(); // Clear the cart
        navigate('/orderManagement'); // Navigate programmatically
    };

    return (
        <div>
            <div className="orderNumberContainer">

                <div className="orderCodeContainer"> IMPORTANT - PLEASE FOLLOW THE STEPS BELOW TO COMPLETE YOUR ORDER!</div>
                <div className="orderCodeContainer">

                    THIS IS YOUR ORDER REFERENCE CODE: {referenceOrderId}
                    <button 
          onClick={handleEmailButtonClick} 
          disabled={emailButtonState.disabled} 
          className={emailButtonState.className}
        >
          {emailButtonState.text}
        </button>
        <button 
          onClick={handleTelButtonClick} 
          disabled={telButtonState.disabled} 
          className={telButtonState.className}
        >
          {telButtonState.text}
        </button>
                </div>
                    
                <div className="orderCodeContainer"> NEXT STEPS: </div>
                <div> (1.) - YOUR ORDER REQUEST HAS BEEN COMPLETED, HOWEVER YOUR ORDER IS NOT YET COMPLETE. </div>
                <div> (2.) - A COMPLETED ORDER REQUIRES: (a). ORDER PAYMENT (b). A VALID PICKUP DATE</div> 
                <div> (3.) - TO COMPLETE YOUR ORDER, LOG-IN THROUGH OUT ORDER MANAGEMENT PAGE USING: </div>
                <div> (4.) - (a). THE REFERENCE CODE PROVIDED OR (b). A VALID GMAIL ACCOUNT USED TO PLACE THE ORDER</div>
                <div> (5.) - ONCE LOGGED IN, CLICK YOUR ORDER AND FOLLOW THE STEPS THERE.</div>
                <div>
                
                <div className="orderCodeContainer"> ADDITIONAL INFORMATION: </div>
               <div> - IF THERE ARE ANY QUESTIONS PLEASE CONTACT {adminEmail} </div>
               <div> - PICKUP DATE AVAILABILITIES WILL VARY AND ARE SUBJECT TO THE VOLUME OF ORDERS</div>
          
                

                </div>
                
            </div>
            <div className="orderItemsContainer" id="orderRequestSent">
                <div className="orderReviewContainer" id='modal'>
                    {cartItems.map((item) => (
                        <div className='orderItemContainer' id='modal' key={item.id + "-orderReview"}>
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
                <div className="orderSubtotal" id='modal'>
                    {`Total: ${subtotal.toFixed(2)} CAD`} 
                </div>

                <div className="orderCodeNextStepsContainer">
                    <button className="orderManagementLink" onClick={handleOrderManagementClick}>
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderRequestSent;