import { useCart } from "../context/CartContext";
import { calculateSubtotal, calculateTotalItems } from "../functions/checkoutTotal"
import PropTypes from 'prop-types';
import './SubtotalChecker.css'
// import "./FinalizeShoppingCart.css"

const SubtotalChecker = ({ navigateToCheckoutPage, isShoppingCartPage }) => {
    const { cartItems } = useCart();

    if (cartItems.length <= 0) {
        return; // Return null or some JSX to indicate empty cart
    }


    const subtotal = calculateSubtotal(cartItems); // Correctly use calculateSubtotal
    const totalItems = calculateTotalItems(cartItems); // Correctly use calculateTotalItems
    const itemCountLabel = totalItems === 1 ? "item" : "items";

    return (
        <div className="subtotal-container">
            <div className="headerContainer">
                <div className="subtotal-text">Subtotal ({totalItems} {itemCountLabel}):</div>
                <div className="subtotal-amount">${subtotal.toFixed(2)}</div> {/* Use the calculated subtotal */}
            </div>
            {isShoppingCartPage && 
                <div className="checkoutButtonContainer">
                    <button className="checkoutButton" onClick={navigateToCheckoutPage} disabled={cartItems.length <= 0}>
                        Check Out
                    </button>
                </div>
            }
        </div>
    );
};

SubtotalChecker.propTypes = {
    navigateToCheckoutPage: PropTypes.func,
    isShoppingCartPage: PropTypes.bool.isRequired,
};

export default SubtotalChecker;