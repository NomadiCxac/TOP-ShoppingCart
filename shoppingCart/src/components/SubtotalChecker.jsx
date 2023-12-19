import { useCart } from "../context/CartContext";
import { checkoutItemTotal, checkoutItemQuantity }from "../functions/checkoutTotal";
import './SubtotalChecker.css'
// import "./FinalizeShoppingCart.css"

const SubtotalChecker = () => {
    const { cartItems } = useCart();

    const subtotalCart = () => {
        return cartItems.reduce((total, item) => total + checkoutItemTotal(item), 0);
    };

    // Function to calculate the total number of items
    const totalCartItems = () => {
        return cartItems.reduce((total, item) => total + checkoutItemQuantity(item), 0);
    };

    if (cartItems.length <= 0) {
        return; // Return null or some JSX to indicate empty cart
    }

    const itemCountLabel = totalCartItems() === 1 ? "item" : "items";


    return (
        <div className="subtotal-container">
            <div className="headerContainer">
                <div className="subtotal-text">Subtotal ({totalCartItems()} {itemCountLabel}):</div>
                <div className="subtotal-amount">${subtotalCart().toFixed(2)}</div>
            </div>
            <div className="checkoutButtonContainer">
                <button className="checkoutButton">Check Out</button>
            </div>
        </div>
    );
};

export default SubtotalChecker;