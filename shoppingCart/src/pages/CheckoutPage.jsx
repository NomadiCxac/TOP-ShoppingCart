// import "./ShoppingCartPage.css"
import FinalizeShoppingCart from "../components/finalizeShoppingCart";
import SubtotalChecker from "../components/SubtotalChecker";
// import CreateGoogleForm from "../components/createGoogleForm";
import OrderForm from "../components/orderForm";
import UseGoogleForm from "../components/useGoogleForm";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import './pageNavigation.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkoutPage"); // Navigate to the checkout page
    }
  }


    return (
    
    <div id="checkoutPage">
        <div className="formContainer">
            <OrderForm />
            {/* <UseGoogleForm /> */}

        </div>

        <div className="checkoutItemsContainer">
            <SubtotalChecker 
                    handleCheckout={handleCheckout}
            />
            <FinalizeShoppingCart/>
        </div>



    </div>
       
    )
}

export default CheckoutPage;