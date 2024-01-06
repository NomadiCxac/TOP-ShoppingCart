import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { useState } from "react";
import OrderItemView from "./orderItemView";
import React from "react";
import Modal from "./Modal";
import './OrderList.css'


const OrderList = () => {

    const { retrieveOrdersFromDatabase, retrieveOrdersByEmail } = useFirebaseOrders()
    const [email, setEmail] = useState("")
    const [ordersData, setOrdersData] = useState([])
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [orderItemsPrepared, setOrderItemsPrepared] = useState({});

        // Function to handle the prepared toggle
        const handleItemPreparedToggle = (order, itemName) => {
          setOrderItemsPrepared(prevState => {
            const orderPrepared = prevState[order] || {};
            const isPrepared = orderPrepared[itemName] || false;
        
            return {
              ...prevState,
              [order]: {
                ...orderPrepared,
                [itemName]: !isPrepared
              }
            };
          });
        };
  
      // Function to calculate the number of prepared items
      const countPreparedItems = (orderId) => {
          const orderPrepared = orderItemsPrepared[orderId];
          return orderPrepared ? Object.values(orderPrepared).filter(isPrepared => isPrepared).length : 0;
      };

    const toggleModal = (order) => {
      setCurrentOrder(order);
      setModalOpen(!isModalOpen);
    };


    function emailQueryHandler (e) {
        setEmail(e.target.value);
    }

    const handleRetrieveOrders = async () => {
        const orders = await retrieveOrdersFromDatabase();
        setOrdersData(orders); // Update the state with the fetched orders
    };

    const handleRetrieveOrdersByEmail = async () => {
        const orders = await retrieveOrdersByEmail(email);
        setOrdersData(orders); // Update the state with the fetched orders
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
          <React.Fragment key={`order-${order.id}`}>
            <tr key={order.id}>
              <td className="no-wrap" id="orderId">{order.id}</td>
              <td>
              {countPreparedItems(order.id)}/{Object.keys(order.items).length}
                <button onClick={() => toggleModal(order)}>
                  {!isModalOpen ? '+' : '-'}
                </button>
              </td>
              <td className="no-wrap">{order.dateOrderGenerated}</td>
              <td className="no-wrap">Order Verification Status Here</td>
              <td className="no-wrap">{order.date}</td>
              <td className="no-wrap">Actual Pick Up Date Here</td>
              <td>{order.name}</td>
              <td>{order.email}</td>
              <td>
              <button onClick={() => toggleModal(order.id)}>
                  {!isModalOpen ? '+' : '-'}
                </button>
              </td>

           
              <td className={order.clientPaid ? 'paid' : 'unpaid'}>
                {order.clientPaid ? 'Paid' : 'Unpaid'}
              </td>
              <td className={`status ${order.itemsFulfilled ? 'fulfilled' : 'unfulfilled'}`}>
                {order.itemsFulfilled ? 'Fulfilled' : 'Unfulfilled'}
              </td>

            
            </tr>
          </React.Fragment>
        ))}
        </tbody>
      </table>
  </div>
  {currentOrder && 
    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
      <div className="modalHeader">
        <p className="modalText">Order ID: {currentOrder.id}</p>
        <p className="modalText">Customer Email: {currentOrder.email}</p>
        <p className="modalText">Customer Name: {currentOrder.name}</p>
        <p className="modalText">Order Subtotal: ${currentOrder.subtotal}.00 </p>
      </div>
        <OrderItemView 
          items={currentOrder.items} 
          preparedStatus={orderItemsPrepared[currentOrder.id] || {}} 
          onItemPreparedToggle={(itemName) => handleItemPreparedToggle(currentOrder.id, itemName)} 
        />
     </Modal>}
    </div>
  );
};

export default OrderList;