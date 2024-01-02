// import "./ShoppingCartPage.css"
import FinalizeShoppingCart from "../components/finalizeShoppingCart";
import SubtotalChecker from "../components/SubtotalChecker";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import '../App.css';
import { useFirebase } from "../context/FirebaseContext";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user } = useFirebase()

  const navigateToCheckoutPage = () => {
    if (cartItems.length > 0) {
      console.log(cartItems)
      console.log(user);
      navigate("/checkoutPage"); // Navigate to the checkout page
    }
  }


    return (
    
    <div id="shoppingCartPage">
      <FinalizeShoppingCart/>
      <SubtotalChecker 
          navigateToCheckoutPage={navigateToCheckoutPage}
          isShoppingCartPage={true}
      />
    </div>
       
    )
}

export default ShoppingCartPage;