import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { useState } from "react";
import OrderItemView from "./orderItemView";
import './OrderList.css'


const OrderList = () => {

    const [email, setEmail] = useState("")
    const [ordersData, setOrdersData] = useState([])
    const [minimizedOrders, setMinimizedOrders] = useState(new Set()); // Tracks the IDs of minimized orders

    const toggleMinimize = (orderId) => {
        setMinimizedOrders(prevState => {
            const newSet = new Set(prevState);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const { retrieveOrdersFromDatabase, retrieveOrdersByEmail } = useFirebaseOrders()

    function emailQueryHandler (e) {
        setEmail(e.target.value);
    }

    const handleRetrieveOrders = async () => {
        const orders = await retrieveOrdersFromDatabase();
        setOrdersData(orders); // Update the state with the fetched orders
        if (orders) {
            setMinimizedOrders(new Set(orders.map(order => order.id)));
        }

    };

    const handleRetrieveOrdersByEmail = async () => {
        const orders = await retrieveOrdersByEmail(email);
        setOrdersData(orders); // Update the state with the fetched orders
        if (orders) {
            setMinimizedOrders(new Set(orders.map(order => order.id)));
        }
    };


  return (
        <div className="order-list">
        <div className="filters">
            <input type="text" value={email} onChange={emailQueryHandler} placeholder="Filter by email..." />
            <button onClick={handleRetrieveOrdersByEmail}>Retrieve Orders By Email</button>
            <button onClick={handleRetrieveOrders}>Retrieve All Orders</button>
        </div>
        <div className="scrollable-table-container"> 
        <table className="orders-table">
            <thead>
            <tr>
                <th>Order ID</th>
                <th>Order Items</th>
                <th>Date Order Generated</th>
                <th>Order Verification Status</th>
                <th>Client Set Pick Up Date</th>
                <th>Actual Pick Up Date</th>
                <th>Customer Name</th>
                <th>Customer Email</th>
                <th>Payment Status</th>
                <th>Order Ready for Pick Up</th>
                <th>Order Complete</th>
                {/* Add more headers if needed */}
            </tr>
            </thead>
            <tbody>
        {ordersData && ordersData.map(order => (
          <>
            <tr key={order.id}>
              <td className="no-wrap" id="orderId">{order.id}</td>
              <td>
                <button onClick={() => toggleMinimize(order.id)}>
                  {minimizedOrders.has(order.id) ? '+' : '-'}
                </button>
              </td>
              <td className="no-wrap">{order.dateOrderGenerated}</td>
              <td className="no-wrap">Order Verification Status Here</td>
              <td className="no-wrap">{order.date}</td>
              <td className="no-wrap">Actual Pick Up Date Here</td>
              <td>{order.name}</td>
              <td>{order.email}</td>

              <button onClick={() => toggleMinimize(order.id)}>
                  {minimizedOrders.has(order.id) ? '+' : '-'}
                </button>
           
              <td className={order.clientPaid ? 'paid' : 'unpaid'}>
                {order.clientPaid ? 'Paid' : 'Unpaid'}
              </td>
              <td className={`status ${order.itemsFulfilled ? 'fulfilled' : 'unfulfilled'}`}>
                {order.itemsFulfilled ? 'Fulfilled' : 'Unfulfilled'}
              </td>
            </tr>
            {!minimizedOrders.has(order.id) && (
              <tr>
                <td colSpan="9">
                  <OrderItemView items={order.items} />
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
        </table>
        </div>
    </div>
  );
};

export default OrderList;