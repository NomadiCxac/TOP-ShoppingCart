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
  const { cartItems, clearCart } = useCart();

  useEffect(() => {
    document.title = 'KSR - Your Shopping Cart';
  }, []);

  useEffect(() => {
    // clearCart();
    console.log(cartItems)
}, [])

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
        <div className='leftContainer'> 
          <FinalizeShoppingCart 
            pageName={"shoppingCartPage"}
          />
        </div>
        

        <div className='rightContainer'> 
          <SubtotalChecker 
            navigateToCheckoutPage={navigateToCheckoutPage}
            isShoppingCartPage={true}
            pageName={"shoppingCartPage"}
          />

          <div className='addressContainer'>

            <div className='disclaimerText'>
              <span>PICK UP ONLY </span>&nbsp;@ 225, SELWYN RD, RICHMOND HILL ON
            </div>


            <div className='mapContainer' id='map'>
                <iframe
                  style={{width: '20em', height: '361px', border: '1px solid black'}}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22990.550717128324!2d-79.4838431848177!3d43.92172459443965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882ad5ffc67aa1fd%3A0xbb74a7991d299797!2s225%20Selwyn%20Rd%2C%20Richmond%20Hill%2C%20ON%20L4E%200R4!5e0!3m2!1sen!2sca!4v1710603195778!5m2!1sen!2sca"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  >
                </iframe>
            </div>
          </div>
        </div>

        
      </div>
    );
  }
}

export default ShoppingCartPage;