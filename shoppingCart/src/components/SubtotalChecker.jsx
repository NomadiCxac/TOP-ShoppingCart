import { useFirebase } from "../context/FirebaseContext";
import { useCart } from "../context/CartContext";
import { calculateSubtotal, calculateTotalItems } from "../functions/checkoutTotal"
import PropTypes from 'prop-types';

const SubtotalChecker = ({ navigateToCheckoutPage, isShoppingCartPage, pageName }) => {
    const { cartItems } = useCart();
    const { isOrderingAvailable } = useFirebase(); // Use isOrderingAvailable state

    if (cartItems.length <= 0) {
        return; // Return null or some JSX to indicate empty cart
    }


    const subtotal = calculateSubtotal(cartItems); // Correctly use calculateSubtotal
    const totalItems = calculateTotalItems(cartItems); // Correctly use calculateTotalItems
    const itemCountLabel = totalItems === 1 ? "item" : "items";

    return (
        <div className="subtotal-container" id={pageName}>
            <div className="headerContainer" id={pageName}>
                <div className="subtotal-text" id={pageName}>Subtotal ({totalItems} {itemCountLabel}):</div>
                <div className="subtotal-amount" id={pageName}>${subtotal.toFixed(2)}</div>
            </div>
            {isShoppingCartPage && 
                <div className="checkoutButtonContainer">
                    <button 
                        className="checkoutButton" 
                        id={isOrderingAvailable ? "enabled" : "disabled"}
                        onClick={navigateToCheckoutPage}
                        disabled={!isOrderingAvailable || cartItems.length <= 0} // Disable if not available or cart is empty
                    >
                        {isOrderingAvailable ? "Proceed to Next Step" : "Ordering Unavailable"}
                    </button>
                </div>
            }
        </div>
        )
    };


SubtotalChecker.propTypes = {
    navigateToCheckoutPage: PropTypes.func,
    isShoppingCartPage: PropTypes.bool.isRequired,
    pageName: PropTypes.string
};

export default SubtotalChecker;