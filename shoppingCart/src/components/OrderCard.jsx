// OrderCard.jsx
import PropTypes from 'prop-types';

import formatName from "../functions/formatName";
import resolveImageUrl from "../functions/resolveImageUrl";
import countItems from "../functions/countItems";
import './OrderCard.css'

const OrderCard = ({ order, onClick }) => {
    // Convert the items object to an array of item objects with name included
    const orderItemsArray = order.items ? Object.entries(order.items).map(([itemName, itemDetails]) => ({
        ...itemDetails,
        name: formatName(itemName),
        imageUrl: resolveImageUrl(itemDetails.id)
    })) : [];


    

    return (
        <div className="orderCard" onClick={() => onClick(order)}>
            <div className="orderCardSummary">
                <div className="orderCardIdContainer"> 
                    <div className="orderIdContainerTitle">Order ID: {order.id}</div>
                    <div className="orderDetailsTitleContainer">Click to View Order Details&gt;</div>
                </div>
                <div className="orderCardConfirmationStatuses">
                    <div className="orderStatusContainer"> Order Status: {order.orderStatus}</div>
                    <div className="orderPickupDateContainer"> Pickup Date: {order.pickUpDate} @ {order.pickUpTime}</div>
                </div>


                <div className="orderCardImages">
                    <div className="orderCardIconTitle">
                        <div className="orderSubtotalContainer">{countItems(orderItemsArray)} item(s) - ${order.subtotal.toFixed(2)} CAD</div>
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

