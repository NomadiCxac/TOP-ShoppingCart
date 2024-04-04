import { useState } from 'react';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import { useFirebase } from '../context/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { calculateSubtotal } from "../functions/checkoutTotal"; 
import { getFunctions, httpsCallable } from 'firebase/functions';

import './OrderForm.css';
import useShoppingCart from '../hooks/useShoppingCart';



const OrderForm = () => {
  const { app, isOrderingAvailable, isOrderCodeNotificationAvailable } = useFirebase();
  const { cartItems, setCartEmail } = useShoppingCart()
  const { updateOrderCodeSent, pushOrderToDatabase } = useFirebaseOrders();
  const navigate = useNavigate(); 
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    comments: '',
  });

  // Get back end functions
  const functions = getFunctions(app);
  const sendOrderReviewEmail = httpsCallable(functions, 'sendOrderReviewEmail');

  const sendEmailNotification = async (orderId, orderDetails, subtotal) => {
    try {
      await sendOrderReviewEmail({
        email: userDetails.email,
        orderDetails: orderDetails,
        subtotal: subtotal,
        orderReference: orderId,
        pageLink: `https://kitchenonselwynroad.com/orderManagement/${orderId}`
      });
      await updateOrderCodeSent(orderId, 'orderCodeSentByEmail', true);
    } catch (error) {
      console.error("Failed to send email: ", error);
    }
  }




  const pushOrderRequest = async () => {
    if (isOrderingAvailable && cartItems.length > 0) {

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
        
        // Order Payload
        items: formattedItems,
        subtotal: subtotal, 
        ...userDetails, 
       
        // Track order creation date
        dateOrderGenerated: getCurrentDateTime(),
        orderStatus: "Payment Pending",

        // Pickup details for order
        pickUpDate: "",
        pickUpTime: "",
        pickUpMonth: "",
        
        // Production details for order
        clientPaid: false,
        productionReady: false, 
        readyForClientPickUp: false,

        // Data archiving details for order
        orderComplete: false, 
        dateOrderComplete: null,

        // Order phase
        orderPhase: "step1",

        // Admin comments on orders
        adminComments: "",

        // Order code details for order
        orderCodeSentByEmail: false,
        orderCodeSentByPhone: false,

      };

      try {
        const orderId = await pushOrderToDatabase(orderDetails);
        const reviewPage = true; 
        navigate(`/orderManagement/${orderId}?reviewPage=${reviewPage}`);

        if (isOrderCodeNotificationAvailable) {
          await sendEmailNotification(orderId, orderDetails.items, subtotal.toFixed(2));
        }


        return orderId;
      } catch (error) {
        console.error("Failed to push order to database:", error);
      }

  }
}

  function getCurrentDateTime() {
    const current = new Date(); // Get the current date and time

    // Extracting individual components
    const month = current.toLocaleString('default', { month: 'long' }); // Full month name
    const day = current.getDate(); // Day of the month
    const year = current.getFullYear(); // Year



    // Combine the components in the desired format "Month, Day, Year, Time"
    return `${month}, ${day}, ${year}`;
}

  // Handler for the name input
  const handleNameChange = (event) => {
    setUserDetails({ ...userDetails, name: event.target.value });
  };

  // Handler for the email input
  const handleEmailChange = (event) => {
    setUserDetails({ ...userDetails, email: event.target.value });
    setCartEmail(event.target.value)
  };

  const handlePhoneChange = (event) => {
    setUserDetails({ ...userDetails, phone: event.target.value });
  };
  
  // Handler for the comments textarea
  const handleCommentsChange = (event) => {
    setUserDetails({ ...userDetails, comments: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await pushOrderRequest();
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Order Request Information</h2>
      <label htmlFor="name">
        <div>
            <span className='requiredStar'>*</span>Name 
        </div>

        <span className='requiredText'> Required</span>
      </label>
      
      <input 
        type="text" 
        id="name" 
        value={userDetails.name} 
        onChange={handleNameChange} 
        placeholder="Name" 
        required
      />
      <label htmlFor="email">
        <div>
          <span className='requiredStar'>*</span>Email 
        </div>

        <span className='requiredText'> Required</span>
      </label>
      <input 
        type="email" 
        id="email" 
        value={userDetails.email} 
        onChange={handleEmailChange} 
        placeholder="Email" 
        required
      />
       <label htmlFor="phone">        
          <div>
            <span className='requiredStar'>*</span>Phone
          </div>

          <span className='requiredText'> Required</span>
      </label>
      <input 
        type="tel" 
        id="phone" 
        value={userDetails.phone} 
        onChange={handlePhoneChange} 
        placeholder="416-456-7890"
        pattern="([2-9]\d{2}-\d{3}-\d{4})|([2-9]\d{9})"
        title="Phone number should be in the format: 416-456-7890 or 4164567890"
        required
      />
      <label htmlFor="comments">Additional Comments</label>
      <textarea id="comments" value={userDetails.comments} onChange={handleCommentsChange} placeholder="Add comments"></textarea>
      <div className='checkoutButtonContainer'>
        <button 
          type="submit"
          className="checkoutButton" 
          id={isOrderingAvailable ? "enabled" : "disabled"}
          disabled={!isOrderingAvailable || cartItems.length <= 0}
        > 
          {isOrderingAvailable ? "Submit Order Request" : "Ordering Unavailable"} 
        </button>
      </div>

      
    </form>
  );
};

export default OrderForm;