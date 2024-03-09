import { useState } from 'react';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import { useCart } from '../context/CartContext';
import { useFirebase } from '../context/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { calculateSubtotal } from "../functions/checkoutTotal"; 

import './OrderForm.css';



const OrderForm = () => {
  const { setReferenceOrderId } = useFirebase();
  const { cartItems } = useCart()
  const { pushOrderToDatabase } = useFirebaseOrders();
  const navigate = useNavigate(); 
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
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
        subtotal: subtotal, 
        ...userDetails, 
       
        dateOrderGenerated: getCurrentDateTime(),
        orderStatus: "Payment Pending",

        pickUpDate: "",
        pickUpTime: "",
        pickUpMonth: "",
        
        clientPaid: false,
        productionReady: false, 
        readyForClientPickUp: false,

        orderComplete: false, 
        dateOrderComplete: null,

        orderPhase: "step1",

        adminComments: ""

      };

      try {
        console.log("Attempting to push order", orderDetails);
        const orderId = await pushOrderToDatabase(orderDetails);
        console.log("Order ID:", orderId); // Assuming pushOrderToDatabase returns the order ID

        setReferenceOrderId(orderId); // Set the reference order ID in your Firebase context
        console.log("Setting reference order ID:", orderId);

        navigate('/orderRequestSent'); // Navigate to the orderRequestSent page
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
    console.log(userDetails)
    await pushOrderRequest();
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Checkout Information</h2>
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
      <textarea id="comments" value={userDetails.comments} onChange={handleCommentsChange} placeholder="Please enter any specifications..."></textarea>
      <button type="submit">Submit Order Request</button>
      
    </form>
  );
};

export default OrderForm;