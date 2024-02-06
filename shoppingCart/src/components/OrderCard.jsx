// OrderCard.jsx
import formatName from "../functions/formatName";
import './UserDashboard.css'

const OrderCard = ({ order, onClick }) => {
    // Convert the items object to an array of item objects with name included
    const orderItemsArray = Object.entries(order.items).map(([itemName, itemDetails]) => ({
        ...itemDetails,
        name: formatName(itemName), // Use your formatName function or adjust accordingly
    }));
    
    return (
        <div className="orderCard" onClick={() => onClick(order)}>
            <div className="orderSummary">
                <h3>Order Date: {order.dateOrderGenerated}</h3>
                {/* You can add a summary of the order here, like order status or total price */}
            </div>
            {/* Details will be rendered in the Modal, not here */}
        </div>
    );



};

export default OrderCard;


    // return (
    //     <div className={`orderCard ${isExpanded ? 'expanded' : ''}`} onClick={handleClick}>
    //         <div className="orderSummary">
    //             <h3>Order Date: {order.dateOrderGenerated}</h3>
    //         </div>
    //         {isExpanded && (
    //             <div className="orderDetails">
    //                 {/* This will render the details of the order when the card is expanded */}
    //                 {orderItemsArray.map((item, index) => (
    //                     <div key={index} className="orderItemDetail">
    //                         <img src={item.imageURL || '/images/defaultFood.jpeg'} alt={item.name} className="itemImage" />
    //                         <div>
    //                             <h4>{item.name}</h4>
    //                             <p>Quantity: {item.quantity}</p>
    //                             {/* You can add more item details here */}
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>
    //         )}
    //     </div>
    // );