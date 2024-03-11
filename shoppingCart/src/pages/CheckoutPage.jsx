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

      navigate('/shoppingCartPage'); 

    }
    console.log(cartItems)
  }, [cartItems, navigate]);

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