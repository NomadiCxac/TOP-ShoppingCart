import { useCart } from "../context/CartContext";
import checkoutItemTotal from "../functions/checkoutTotal";
import './SubtotalChecker.css'
// import "./FinalizeShoppingCart.css"

const SubtotalChecker = () => {
    const { cartItems } = useCart();

    const subtotalCart = () => {
        let subtotal = 0;
        for (let item in cartItems) {
            subtotal += checkoutItemTotal(cartItems[item]);
        }
        return subtotal;
    }

    if (cartItems.length === 0) {
        return (
            <div className="subtotal-text">Your Cart is Empty</div>
        );
    }

    return (
        <div className="subtotal-container">
            {cartItems.length === 1 ? (
                <div className="headerContainer">
                    <div className="subtotal-text">Subtotal ({cartItems.length} item):</div>
                    <div className="subtotal-amount">${subtotalCart().toFixed(2)}</div>
                </div>
            ) : (
                <div className="headerContainer">
                    <div className="subtotal-text">Subtotal ({cartItems.length} items):</div>
                    <div className="subtotal-amount">${subtotalCart().toFixed(2)}</div>
                </div>
            )}
            <div className="checkoutButtonContainer">
                <button className="checkoutButton">Check Out</button>
            </div>
        </div>
    );
}

export default SubtotalChecker;