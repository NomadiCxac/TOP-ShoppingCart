import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import "./NavigationBar.css";


const NavigationBar = () => {

    const { cartItems } = useCart() 
   
    let itemCount = 0;

    for (let item in cartItems) {
        itemCount += cartItems[item].quantity;
    }

    console.log(cartItems);

        return (
            <div className="navBar">
                {/* Link to the home page */}
                <div className='landingPage'>
                    <Link to="/" className='clickableLink'>Home</Link>
                </div>
    
                {/* If you have routes for these, wrap them in Link as well */}
                <div className='checkoutPage'>
                    <Link to="/checkout">Checkout</Link>
                </div>
                <div className='shoppingCartPage'>
                    <Link to="/cart">Shopping Cart</Link>
                    {itemCount > 0 && <span className="cartItemCount">{itemCount}</span>}
                </div>
            </div>
        );
    };

export default NavigationBar;