// OrderCard.jsx
import formatName from "../functions/formatName";
import resolveImageUrl from "../functions/resolveImageUrl";
import countItems from "../functions/countItems";
import './OrderCard.css'

const OrderCard = ({ order, onClick }) => {
    // Convert the items object to an array of item objects with name included
    const orderItemsArray = Object.entries(order.items).map(([itemName, itemDetails]) => ({
        ...itemDetails,
        name: formatName(itemName), // Use your formatName function or adjust accordingly
    }));



    

    return (
        <div className="orderCard" onClick={() => onClick(order)}>
            <div className="orderCardSummary">
                <div className="orderCardIdContainer"> 
                    <h3>Order ID: {order.id}</h3>
                    <h6>Click to View Order Details&gt;</h6>
                </div>
                <div className="orderCardConfirmationStatuses">
                    <h5> Order Status: {order.orderVerifiedStatus}</h5>
                    <h5> Pickup Date: {order.pickUpDate} @ {order.pickUpTime}</h5>
                </div>


                <div className="orderCardImages">
                    <div className="orderCardIconTitle">
                        <h6>{countItems(orderItemsArray)} item(s) - ${order.subtotal} CAD</h6>
                    </div>
                    <div className="orderCardIconContainer">
                        {orderItemsArray.map((item) => (
                            <img className="orderCardIcon" key={item.id} src={resolveImageUrl(item.id)} alt={item.name} />
                        ))}
                    </div>
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