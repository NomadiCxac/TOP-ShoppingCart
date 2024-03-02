import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { useEffect, useState } from "react";
import OrderItemView from "./OrderItemView";
import React from "react";
import Modal from "./Modal";
import Instructions from "./Instructions";
import formatName from "../functions/formatName";
import './SetPaymentStatus.css'


const SetPaymentStatus = ({ phase }) => {

    const { retrieveOrdersByPhase } = useFirebaseOrders()
    const [email, setEmail] = useState("")
    const [ordersData, setOrdersData] = useState([])
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    const toggleModal = (order) => {
      setCurrentOrder(order);
      setModalOpen(!isModalOpen);
    };

    
    const handleCloseModal = () => {
      setModalOpen(false);
      setCurrentOrder(null);
  };


    function emailQueryHandler (e) {
        setEmail(e.target.value);
    }

    const handleRetrieveOrdersByPhase = async () => {
      const orders = await retrieveOrdersByPhase(phase);
      setOrdersData(orders); // Update the state with the fetched orders
  };

  const renderItemsDetails = () => {
    const itemsArray = currentOrder ? Object.values(currentOrder.items) : [];
  
    return (
      <div className="orderContentsContainer" id="adminPaymentsPendingModal">
        {itemsArray.map((item, index) => {
          let name = formatName(item.id);
          if (item.batched) {
            // Item is batched, show separate line items for half dozen and dozen
            return (
              <div key={index}>
                {item.halfDozenQuantity > 0 && (
                  <div>Half a Dozen {name} - {item.halfDozenQuantity} x ${item.halfDozenPrice.toFixed(2)}</div>
                )}
                {item.dozenQuantity > 0 && (
                  <div>Dozen {name} - {item.dozenQuantity} x ${item.dozenPrice.toFixed(2)}</div>
                )}
              </div>
            );
          } else {
            // Item is not batched, show total quantity and price
            // Assuming there is a 'price' field for non-batched items to fix the .toFixed application
            return (
              <div key={index}>
                <div>{name} - {item.quantity} x ${item.price.toFixed(2)}</div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
        <div className="order-list">
          {/* <Instructions 
          instructions={instructionsArray}
          /> */}
        <div className="filters">
            <button onClick={handleRetrieveOrdersByPhase} className="loadOrdersButton">Load Orders</button>
        </div>
        <div className="scrollable-table-container"> 
        <table className="orders-table">
        <thead>
          <tr>
            <th className="order-id">Order ID</th>
            <th className="date-order-generated">Date Order Generated</th>
            <th className="customer-name">Customer Name</th>
            <th className="customer-email">Customer Email</th>
            <th className="order-subtotal">Order Subtotal</th>
            <th className="payment-status">Set Payment Status</th>
          </tr>
        </thead>
            <tbody>
  {ordersData.length > 0 ? (
    ordersData.map(order => order && (
      <React.Fragment key={order.id}>
        <tr>
          <td>{order.id}</td>
          <td>{order.dateOrderGenerated}</td>
          <td>{order.name}</td>
          <td>{order.email}</td>
          <td>${order.subtotal.toFixed(2)}</td>
          {/* <td>{order.clientPaid ? 'Paid' : 'Unpaid'}</td> */}
          {/* <td>{order.itemsFulfilled ? 'Fulfilled' : 'Unfulfilled'}</td> */}
          {/* Additional fields */}
          <td>
            <button onClick={() => toggleModal(order)}>Details</button>
          </td>
        </tr>
      </React.Fragment>
    ))
  ) : (
    <tr>
      <td colSpan="6" style={{ textAlign: 'center' }}>No orders found.</td>
    </tr>
  )}
</tbody>
      </table>
  </div>
  {currentOrder && 
    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} orientation={'close-button-default'} id={"payments-pending"}>
      <div className="leftHalf">
        <div className="informationContainer">
          <p className="modalText">Order ID: {currentOrder.id}</p>
          <p className="modalText">Customer Email: {currentOrder.email}</p>
          <p className="modalText">Customer Name: {currentOrder.name}</p>
          <p className="modalText" id="subtotal">Order Subtotal: ${currentOrder.subtotal.toFixed(2)} </p>
        </div>
        <div className="switchContainer">
          <div>Is this order correct?</div>
          <button className="confirmPaymentButton">Confirm Order Payment</button>
        </div>
      </div>
      <div className="rightHalf">
        {renderItemsDetails()}
      </div>

      <div className='closeButtonContainer'>
        <p onClick={handleCloseModal} className="close-button" aria-label="Close modal">
            &times;
        </p>
      </div>
     </Modal>}
    </div>
  );
};

export default SetPaymentStatus;