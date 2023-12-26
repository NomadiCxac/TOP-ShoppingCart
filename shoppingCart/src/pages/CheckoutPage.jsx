import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/fireBaseOrders";
import FinalizeShoppingCart from "../components/finalizeShoppingCart";
import SubtotalChecker from "../components/SubtotalChecker";
import OrderForm from "../components/orderForm";
import { calculateSubtotal } from "../functions/checkoutTotal"; // Import the calculateSubtotal function
import './pageNavigation.css';
// import CreateGoogleForm from "../components/createGoogleForm";
// import UseGoogleForm from "../components/useGoogleForm";
// import useFirebaseOrders from "../states/useFirebaseOrders";


const CheckoutPage = () => {
  // const navigate = useNavigate();
  const { cartItems } = useCart();
  const { pushOrderToDatabase } = useOrders()
  console.log(pushOrderToDatabase)
  const [ userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    date: '',
    comments: '',
});


  const pushOrderRequest = async () => {
    if (cartItems.length > 0) {

      const formattedItems = cartItems.reduce((acc, item) => {
        // Start with the basic properties
        const formattedItem = {
          batched: item.batched,
          id: item.id,
        };
  
        // Conditionally add properties if they exist
        if (item.quantity !== undefined || item.quantity > 0) formattedItem.quantity = item.quantity;
        if (item.halfDozenQuantity !== undefined || item.halfDozenQuantity > 0) formattedItem.halfDozenQuantity = item.halfDozenQuantity;
        if (item.dozenQuantity !== undefined || item.dozenQuantity > 0) formattedItem.dozenQuantity = item.dozenQuantity;
        if (item.dozenPrice !== undefined || item.dozenPrice > 0) formattedItem.dozenPrice = item.dozenPrice;
        if (item.halfDozenPrice !== undefined || item.halfDozenPrice > 0) formattedItem.halfDozenPrice = item.halfDozenPrice;
        if (item.price !== undefined || item.price > 0) formattedItem.price = item.price;
  
        // Assign the formatted item to the accumulator using its ID as the key
        acc[item.id] = formattedItem;
        return acc;
      }, {});

      const subtotal = calculateSubtotal(cartItems); // Use the calculateSubtotal function
      const orderDetails = {
        items: formattedItems,
        subtotal: subtotal, // Use the calculated subtotal
        ...userDetails,
      };

      try {
        console.log("Attempting to push order", orderDetails);
        await pushOrderToDatabase(orderDetails);
      } catch (error) {
        console.error("Failed to push order to database:", error);
      }

  }
}


    return (
    
    <div id="checkoutPage">
        <div className="formContainer">
            <OrderForm 
             setUserDetails={setUserDetails}
             pushOrderRequest={pushOrderRequest}
            />
            {/* <UseGoogleForm /> */}

        </div>

        <div className="checkoutItemsContainer">
            <SubtotalChecker
              navigateToCheckoutPage={null}
              isShoppingCartPage={false}
              />
            <FinalizeShoppingCart/>
        </div>



    </div>
       
    )
  }

export default CheckoutPage;