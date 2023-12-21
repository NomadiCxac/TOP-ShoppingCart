// import "./ShoppingCartPage.css"
import FinalizeShoppingCart from "../components/finalizeShoppingCart";
import SubtotalChecker from "../components/SubtotalChecker";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import '../App.css';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkoutPage"); // Navigate to the checkout page
    }
  }


    return (
    
    <div id="shoppingCartPage">
      <FinalizeShoppingCart/>
      <SubtotalChecker 
        handleCheckout={handleCheckout}
      />
    </div>
       
    )
}

export default ShoppingCartPage;