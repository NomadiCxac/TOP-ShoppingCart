// OrderCard.jsx
import formatName from "../functions/formatName";
import resolveImageUrl from "../functions/resolveImageUrl";
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
                <h3> Order Date: {order.dateOrderGenerated}</h3>
                <h5> Order Status: {order.orderVerifiedStatus}</h5>
                <h5> Order Subtotal: {order.subtotal}</h5>
                <p>(Click to View Order Details)</p>
                <div className="orderImages">
                    {orderItemsArray.map((item) => (
                        <img className="orderCardIcon" key={item.id} src={resolveImageUrl(item.id)} alt={item.name} />
                    ))}
                </div>
                {/* You can add a summary of the order here, like order status or total price */}
            </div>
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