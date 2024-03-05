import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { useEffect, useState } from "react";
import OrderItemView from "./OrderItemView";
import React from "react";
import Modal from "./Modal";
import './OrderList.css'


const OrderList = ({ phase }) => {

    const { retrieveAllOrdersFromDatabase, retrieveOrdersByEmail, retrieveOrdersByPhase } = useFirebaseOrders()
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
        const orders = await retrieveAllOrdersFromDatabase();
        setOrdersData(orders); // Update the state with the fetched orders
    };

    const handleRetrieveOrdersByEmail = async () => {
        const orders = await retrieveOrdersByEmail(email);
        console.log(orders)
        setOrdersData(orders); // Update the state with the fetched orders
    };


    const handleRetrieveOrdersByPhase = async () => {
      const orders = await retrieveOrdersByPhase(phase);
      setOrdersData(orders); // Update the state with the fetched orders
  };

  useEffect (() => {
    console.log(ordersData.length > 0)
  })


  return (
        <div className="order-list">
        <div className="filters">
            <input type="text" value={email} onChange={emailQueryHandler} placeholder="Filter by email..." />
            <button onClick={handleRetrieveOrdersByEmail}>Retrieve Orders By Email</button>
            <button onClick={handleRetrieveOrders}>Retrieve All Orders</button>
            <button onClick={handleRetrieveOrdersByPhase}>Retrieve Order By Phase</button>
        </div>
        <div className="scrollable-table-container"> 
        <table className="orders-table">
            <thead>
            <tr>

            <th id="order-id">Order ID</th>
            <th id="date-order-generated">Order Req. Start</th>
            <th id="customer-name">Customer Name</th>
            <th id="order-subtotal">Order Subtotal</th>
            <th id="order-status">Order Status</th>
            <th className="booleanField" id="pickup-date">Pick Up Date</th>
            <th className="booleanField" id="payment-status">Paid Status</th>
            <th className="booleanField" id="production-status">Prod. Status</th>

            </tr>
            </thead>
            <tbody>
  {ordersData.length > 0 ? (
    ordersData.map(order => order && (
      <React.Fragment key={order.id}>
        <tr>
          <td onClick={() => toggleModal(order)}>{order.id}</td>
          <td>{order.dateOrderGenerated}</td>
          <td>{order.name}</td>
          <td>${order.subtotal.toFixed(2)}</td>

          {/* <td>{order.itemsFulfilled ? 'Fulfilled' : 'Unfulfilled'}</td> */}
          {/* Additional fields */}
          <td>
            {order.orderStatus}
            {/* <button onClick={() => toggleModal(order)}>Details</button> */}
          </td>
          <td>{order.pickUpDate ? order.pickUpDate : "Not Set"}</td>
          <td>{order.clientPaid ? 'Paid' : 'Unpaid'}</td>
          <td>{order.productionReady ? 'Yes' : 'No'}</td>
        </tr>
      </React.Fragment>
    ))
  ) : (
    <tr>
      <td colSpan="9" style={{ textAlign: 'center' }}>No orders found.</td>
    </tr>
  )}
</tbody>
      </table>
  </div>
  {currentOrder && 
    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} orientation={'close-button-default'}>
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