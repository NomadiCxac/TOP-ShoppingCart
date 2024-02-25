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
        ...userDetails, // 
        dateOrderGenerated: getCurrentDateTime(),
        orderVerifiedStatus: "Awaiting Pickup Date Confirmation",
        clientPaid: false, // Default value for the new parameter
        actualPickUpDate: null,
        readyForClientPickUp: false, // Default value for the new parameter
        orderComplete: false, // Default value for the new parameter
        dateOrderComplete: null,
        orderPhase: "step1",
        pickUpDate: "",
        pickUpTime: "",
        phone: ""
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
      <label htmlFor="name">Name</label>
      <input type="text" id="name" value={userDetails.name} onChange={handleNameChange} placeholder="Name" />
      <label htmlFor="email">Email</label>
      <input type="email" id="email" value={userDetails.email} onChange={handleEmailChange} placeholder="Email" />
      {/* <label htmlFor="date">Choose a Pickup-Date </label>
      <input type="date" id="date" value={userDetails.date} onChange={handleDateChange} /> */}
      <label htmlFor="comments">Additional Comments</label>
      <textarea id="comments" value={userDetails.comments} onChange={handleCommentsChange} placeholder="Additional Comments"></textarea>
      <button type="submit">Submit Order Request</button>
      
    </form>
  );
};

export default OrderForm;