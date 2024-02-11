import { useState } from "react";
import { useCart } from "../context/CartContext";
import FinalizeShoppingCart from "../components/FinalizeShoppingCart";
import SubtotalChecker from "../components/SubtotalChecker";
import OrderForm from "../components/OrderForm";
import { calculateSubtotal } from "../functions/checkoutTotal"; // Import the calculateSubtotal function
import './pageNavigation.css';
import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
// import CreateGoogleForm from "../components/createGoogleForm";
// import UseGoogleForm from "../components/useGoogleForm";
// import useFirebaseOrders from "../states/useFirebaseOrders";

function getCurrentDateTime() {
  const current = new Date(); // Get the current date and time

  // Extracting individual components
  const month = current.toLocaleString('default', { month: 'long' }); // Full month name
  const day = current.getDate(); // Day of the month
  const year = current.getFullYear(); // Year

  // Combine the components in the desired format "Month, Day, Year, Time"
  return `${month}, ${day}, ${year}`;
}


const CheckoutPage = () => {
  // const navigate = useNavigate();
  const { cartItems } = useCart();
  const { pushOrderToDatabase } = useFirebaseOrders();
  const [ userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    date: '',
    comments: '',
});

console.log("Current userDetails state:", userDetails);


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
        dateOrderGenerated: getCurrentDateTime(),
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