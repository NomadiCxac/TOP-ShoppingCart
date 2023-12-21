import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import CartItemCard from "./cartItemCard";
import "./FinalizeShoppingCart.css"

const FinalizeShoppingCart = () => {
    const { addToCart, removeFromCart, cartItems } = useCart();

    // Define the maximum quantity
    const maxQuantity = 30;

    // Create an array of option elements
    const quantityOptions = [];
    for (let i = 1; i <= maxQuantity; i++) {
        quantityOptions.push(<option key={i} value={i}>{i}</option>);
    }

    const handleQuantityChange = (e, item, isDozen) => {
        const newQuantity = e.target.value;
        if (newQuantity === '0') {
            removeFromCart(item, isDozen);
        } else {
            addToCart(item, newQuantity, isDozen, false, false);
        }
    };
      // Determine the id based on whether the cart is empty
      const containerId = cartItems.length > 0 ? "notEmpty" : "empty";


      return (
        <div className="checkoutShoppingCartContainer" id={containerId}>
        
            {cartItems.length > 0 ? (
                <div className="cartHeader">
                    <h2>Your Shopping Cart:</h2>
                    <h4>Price:</h4>
                </div>
            ) : (
                <h2>Your Shopping Cart is Empty.</h2>
            )}
        <div className="cartItemContainer" id={containerId}>
            {cartItems.length === 0 && (
                <div id="emptyShoppingCart">
                    <p>Your shopping cart is hungry for delicious baked goods.</p>
                    <p>Continue shopping by going back to the <Link to="/">homepage.</Link></p>
                </div>
            )}

            {cartItems.map(item => item.batched ? (
                <>
                    {item.dozenQuantity > 0 && (
                        <CartItemCard
                            key={item.id + "-dozen"}
                            item={item}
                            handleQuantityChange={handleQuantityChange}
                            quantityOptions={quantityOptions}
                            batched={true}
                            dozenQuantity={item.dozenQuantity}
                            halfDozenQuantity={0}
                            isDozen={true}
                        />
                    )}
                    {item.halfDozenQuantity > 0 && (
                        <CartItemCard
                            key={item.id + "-halfDozen"}
                            item={item}
                            handleQuantityChange={handleQuantityChange}
                            quantityOptions={quantityOptions}
                            batched={true}
                            dozenQuantity={0}
                            halfDozenQuantity={item.halfDozenQuantity}
                            isDozen={false}
                        />
                    )}
                </>
            ) : (
                <CartItemCard
                    key={item.id}
                    item={item}
                    handleQuantityChange={handleQuantityChange}
                    quantityOptions={quantityOptions}
                    batched={false}
                    dozenQuantity={0}
                    halfDozenQuantity={0}
                    isDozen={false}
                />
            ))}
            </div>
        </div>
    );
};

export default FinalizeShoppingCart;