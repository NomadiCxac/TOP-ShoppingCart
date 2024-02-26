import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import FinalizeShoppingCart from "../components/FinalizeShoppingCart";
import SubtotalChecker from "../components/SubtotalChecker";
import OrderForm from "../components/OrderForm";

import './CheckoutPage.css'

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect or show empty cart message if cart is empty
    if (cartItems.length === 0) {
      // Option 1: Redirect to the shopping cart page or home page
      navigate('/shoppingCartPage'); // Adjust the route as necessary
      
      // Option 2: Alternatively, you could render an empty cart component or message directly here
      // However, using a navigate redirect is likely more user-friendly in this context
    }
    console.log(cartItems)
  }, [cartItems, navigate]);

  // If there are items in the cart, render the checkout page content
  return (
    <div id="checkoutPage">
        <div className="formContainer">
            <OrderForm />
        </div>
        <div className="checkoutItemsContainer">
            <SubtotalChecker 
            isShoppingCartPage={false} 
            pageName={"checkoutPage"}
            />
            <FinalizeShoppingCart 
            pageName={"checkoutPage"}
            />
        </div>
    </div>
  );
};

export default CheckoutPage;