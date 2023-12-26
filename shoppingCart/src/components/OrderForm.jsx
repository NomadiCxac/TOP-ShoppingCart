import { useState } from 'react';
import './OrderForm.css'
// import { db } from '../path/to/your/firebase/config';

const OrderForm = ({ setUserDetails, pushOrderRequest } ) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState('');
  // Add states for other shopping cart details

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUserDetails({ name, email, date, comments });
    await pushOrderRequest(); // Call pushOrderRequest to submit the order.
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
        <h2>Checkout Information</h2>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <label htmlFor="date">Select a Date for Pickup</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <label htmlFor="comments">Additional Comments</label>
        <textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Additional Comments"></textarea>
        <button type="submit" onSubmit={handleSubmit}>Submit Order</button>
    </form>
    );
};


export default OrderForm;