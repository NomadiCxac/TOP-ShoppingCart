import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { useEffect, useState } from "react";
import OrderItemView from "./OrderItemView";
import React from "react";
import Modal from "./Modal";
import Instructions from "./Instructions";
import formatName from "../functions/formatName";
import './SetPaymentStatus.css'


const SetProductionStatus = ({ phase }) => {

    const { retrieveOrdersByPhase, updateOrderPhase, updateAdminComments } = useFirebaseOrders()
    const [ordersData, setOrdersData] = useState([])
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editComment, setEditComment] = useState(""); // To hold the comment being edited

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

  const handleSetProductionStatus = () => {
      let updatePhase = "step4";
      let status = "Your Order is Ready for Pickup";
      updateOrderPhase(currentOrder, updatePhase, status);
      handleCloseModal();
  }


  const handleRetrieveOrdersByPhase = async () => {
      const orders = await retrieveOrdersByPhase(phase);
      setOrdersData(orders); // Update the state with the fetched orders
  };

  const renderItemsDetails = () => {
    const itemsArray = currentOrder ? Object.values(currentOrder.items) : [];
  
    return (
      <div className="orderContentsContainer" id="adminProductionStatusModal">
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
            <th className="production-status">Set Production Status</th>
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
          <td>
            <button onClick={() => toggleModal(order)}>Details</button>
          </td>
        </tr>
      </React.Fragment>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: 'center' }}>No orders found.</td>
    </tr>
  )}
</tbody>
      </table>
  </div>
  {currentOrder && 
    <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} id={"production-status"}>
      <div className="leftHalf">
        <div className="informationContainer">
          <p className="modalText">Order ID: {currentOrder.id}</p>
          <p className="modalText">Customer Email: {currentOrder.email}</p>
          <p className="modalText">Customer Name: {currentOrder.name}</p>
          <p className="modalText" id="subtotal">Order Subtotal: ${currentOrder.subtotal.toFixed(2)} - Paid </p>
        </div>
        <div className="switchContainer">
          <div className="confirmPaymentInstructionsContainer">
            <div id="confirmTitle">Please consider the following:</div>
            <div>i. This order will have a production status set to: TRUE </div>
            <div>ii. This order will be removed from the SET PRODUCTION STATUS search section</div>
          </div>

          <button className="confirmProductionButton" onClick={handleSetProductionStatus}>Confirm Order Production</button>
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

export default SetProductionStatus;