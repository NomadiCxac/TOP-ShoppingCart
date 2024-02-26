import { useFirebase } from "../context/FirebaseContext";
import { useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { Link } from 'react-router-dom';
import resolveImageUrl from "../functions/resolveImageUrl";

import './OrderRequestSentPage.css'

function OrderRequestSent() {
    const { cartItems, clearCart } = useCart();
    const { referenceOrderId } = useFirebase();
    const navigate = useNavigate(); 

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

                <h3>This is Your Order Reference Number:</h3>
                <h1>{referenceOrderId}</h1>
                <h2>Please go to the <span className="orderManagementLink" onClick={handleOrderManagementClick}>Order Management</span> with your Order Reference Number and follow the next steps there.</h2>
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
            </div>
        </div>
    );
}

export default OrderRequestSent;