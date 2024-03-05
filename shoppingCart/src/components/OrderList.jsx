import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { useEffect, useState } from "react";
import OrderItemView from "./OrderItemView";
import React from "react";
import Modal from "./Modal";
import formatName from "../functions/formatName";
import './OrderList.css'


const OrderList = () => {

    const { retrieveAllOrdersFromDatabase, retrieveOrdersByEmail, retrieveOrdersByPhase, updateAdminComments } = useFirebaseOrders()
    const [email, setEmail] = useState("")
    const [ordersData, setOrdersData] = useState([])
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editComment, setEditComment] = useState("")

  
const enterEditMode = () => {
  setIsEditMode(true); // Switch to edit mode
};

const handleSaveComment = async () => {
  try {        
    await updateAdminComments(currentOrder, editComment);

    setIsEditMode(false); // Exit edit mode
      
    // Optional: If your local state needs to be updated to reflect changes (depends on your state management)
    setCurrentOrder({ ...currentOrder, adminComments: editComment });

  } catch (error) {
    console.error("Failed to update comment:", error);
    // Optionally handle the error, e.g., show an error message to the user
  }
};

const toggleModal = (order) => {
  setCurrentOrder(order);
  setModalOpen(!isModalOpen);
  setEditComment(order ? order.adminComments : '');
};

const handleCloseModal = () => {
  setModalOpen(false);
  setCurrentOrder(null);
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

  function getOrderStatusDisplay(orderStatus) {
    if (orderStatus === "Please select a pickup date") {
      return "Client to Pick Date";
    } else if (orderStatus === "Your Order is Ready for Pickup") {
      return "Client to Pickup";
    } else {
      return orderStatus;
    }
  }

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

            <th id="order-id" >Order ID</th>
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
          <td className="clickableOrderId" onClick={() => toggleModal(order)}>{order.id}</td>
          <td>{order.dateOrderGenerated}</td>
          <td>{order.name}</td>
          <td>${order.subtotal.toFixed(2)}</td>
          <td>{getOrderStatusDisplay(order.orderStatus)}</td>
          <td className="booleanCell" id={order.pickUpDate ? "true" : "false"}>
            {order.pickUpDate ? order.pickUpDate : "Not Set"}
            </td>
          <td className="booleanCell" id={order.clientPaid ? "true" : "false"}>
            {order.clientPaid ? 'Paid' : 'Unpaid'}
          </td>
          <td className="booleanCell" id={order.productionReady ? "true" : "false"}>
            {order.productionReady ? 'Yes' : 'No'}
            </td>
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
    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} id={"payments-pending"}>
      <div className="leftHalf">
        <div className="informationContainer">
          <p className="modalText">Order ID: {currentOrder.id}</p>
          <p className="modalText">Customer Email: {currentOrder.email}</p>
          <p className="modalText">Customer Name: {currentOrder.name}</p>
          <p className="modalText" id="subtotal">Order Subtotal: ${currentOrder.subtotal.toFixed(2)} </p>
        </div>
        <div className="logisticsContainer">
          <div className="statusCheckTitle">
            {currentOrder.pickUpDate && currentOrder.pickUpTime && currentOrder.productionReady
              ? <span id="order-ready">ORDER READY</span>
              : <span id="order-not-ready">ORDER NOT READY</span>
            }
          </div>
              <div className="statusCheckContainer" id={currentOrder.pickUpDate ? "true" : "false"}>
              {(currentOrder.pickUpDate && currentOrder.pickUpTime) 
                ? `Pickup Date: ${currentOrder.pickUpDate} @ ${currentOrder.pickUpTime}` 
                : "Pickup Date: Not Set"}
              </div>

              <div className="statusCheckContainer" id={currentOrder.clientPaid ? "true" : "false"}>
                {currentOrder.clientPaid ? "Payment Status: Paid" : "Payment Status: Incomplete" }
              </div>

              <div className="statusCheckContainer" id={currentOrder.productionReady ? "true" : "false"}>
                {currentOrder.productionReady ? "Production Status: Order Ready" : "Production Status: Order Not Ready" }
              </div>
              
          </div>
      </div>
      <div className="rightHalf">
        <div className="order-items-summary-container">

        <div className='closeButtonContainer'>
          <p onClick={handleCloseModal} className="close-button" aria-label="Close modal">
              &times;
          </p>
        </div>
          <div className="orderItemsTitle">
            Order Items
          </div>
            {renderItemsDetails()}


        </div>
        
            <div className="adminCommentsContainer">
              <div className="adminCommentsTitle">Admin Comments</div>
              {
                isEditMode ? (
                  <div className="editMode">
                    <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)}></textarea>
                  </div>
              ) : (

              <div className="commentDisplay">
                <div className="adminTextWrapper">
                  <div className="adminText">{currentOrder.adminComments}</div>
                </div>
              </div>

              )}
               <div className="editCommentButtonContainer">
                  {isEditMode ?  
                  <button  className="saveCommentButton" onClick={handleSaveComment}>
                    Save Comment
                  </button>
                  :                
                  <button className="editCommentButton" onClick={() => enterEditMode(currentOrder.adminComments)}>
                      Edit Comment
                    </button> 
                  }
                </div>
              </div>
               
            </div>


    
     </Modal>}
    </div>
  );
};

export default OrderList;