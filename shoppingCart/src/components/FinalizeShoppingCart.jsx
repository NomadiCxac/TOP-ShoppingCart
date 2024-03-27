import React, { useEffect } from 'react'; // Ensure React is in scope when using JSX since React 17
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import CartItemCard from "./CartItemCard";
import "./FinalizeShoppingCart.css"

const FinalizeShoppingCart = ({pageName}) => {
    const { addToCart, removeFromCart, cartItems } = useCart();

    const maxQuantity = 10;

    const quantityOptions = [];
    for (let i = 1; i <= maxQuantity; i++) {
        quantityOptions.push(<option key={i} value={i}>{i}</option>);
    }

    const handleQuantityChange = (item, isDozen, isHalfDozen) => (e) => {
        const newQuantity = e.target.value || '0';
        if (newQuantity === '0') {
            removeFromCart(item, isDozen);
        } else {
            addToCart(item, newQuantity, isDozen, isHalfDozen, true);
        }
    };

    return (
        <div className="checkoutShoppingCartContainer" id={pageName}>
            {cartItems.length > 0 ? (
                <div className="cartHeader" id={pageName}>
                    <h2>Your Shopping Cart:</h2>
                    <div className='priceTitle'>Price:</div>
                </div>
            ) : (
                <h2>Your Shopping Cart is Empty.</h2>
            )}
            <div className="cartItemContainer" id={pageName}>
                {cartItems.length === 0 && (
                    <div id="emptyShoppingCart">
                        <p>Your shopping cart is hungry for delicious baked goods.</p>
                        <p>Continue shopping by going back to the <Link to="/">homepage.</Link></p>
                        <p>Manage any outsanding orders <Link to="/orderManagement">here</Link></p>
                    </div>
                )}

                {cartItems.map((item, index) => item.batched ? (
                    <React.Fragment key={index}>
                        {item.dozenQuantity > 0 && (
                            <CartItemCard
                                key={item.id + "-dozen"}
                                item={item}
                                handleQuantityChange={handleQuantityChange(item, true, false)}
                                quantityOptions={quantityOptions}
                                batched={true}
                                dozenQuantity={item.dozenQuantity}
                                halfDozenQuantity={0}
                                isDozen={true}
                                pageName={pageName}
                            />
                        )}
                        {item.halfDozenQuantity > 0 && (
                            <CartItemCard
                                key={item.id + "-halfDozen"}
                                item={item}
                                handleQuantityChange={handleQuantityChange(item, false, true)}
                                quantityOptions={quantityOptions}
                                batched={true}
                                dozenQuantity={0}
                                halfDozenQuantity={item.halfDozenQuantity}
                                isDozen={false}
                                pageName={pageName}
                            />
                        )}
                    </React.Fragment>
                ) : (
                    <CartItemCard
                        key={item.id}
                        item={item}
                        handleQuantityChange={handleQuantityChange(item, false, false)}
                        quantityOptions={quantityOptions}
                        batched={false}
                        dozenQuantity={0}
                        halfDozenQuantity={0}
                        isDozen={false}
                        pageName={pageName}
                    />
                ))}
            </div>
        </div>
    );
};

export default FinalizeShoppingCart;