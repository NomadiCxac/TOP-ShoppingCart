// You might need to adjust the import path based on your project structure
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFirebase } from "../context/FirebaseContext";
import FinalizeShoppingCart from "../components/FinalizeShoppingCart";
import SubtotalChecker from "../components/SubtotalChecker";
import EmptyShoppingCart from './EmptyShoppingCartPage';
// import '../App.css';
import './ShoppingCartPage.css'

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  useEffect(() => {
    document.title = 'KSR - Your Shopping Cart';
  }, []);

  useEffect(() => {
    // Set overflow-y of the body to hidden when the component mounts
    document.body.style.overflowY = 'hidden';
    // Reset overflow-y of the body when the component unmounts
    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, []); // The empty array ensures this effect runs only once on mount and unmount

  const navigateToCheckoutPage = () => {
    if (cartItems.length > 0) {
      navigate("/checkoutPage"); // Navigate to the checkout page
    }
  };

  if (cartItems.length === 0) {
    // If there are no items in the cart, render the EmptyShoppingCart component
    return <EmptyShoppingCart />;
  } else {
    // Otherwise, render the shopping cart page with items
    return (
      <div id="shoppingCartPage">
        <FinalizeShoppingCart 
        pageName={"shoppingCartPage"}
        />
        <SubtotalChecker 
          navigateToCheckoutPage={navigateToCheckoutPage}
          isShoppingCartPage={true}
          pageName={"shoppingCartPage"}
        />
      </div>
    );
  }
}

export default ShoppingCartPage;