
// import PropTypes from 'prop-types';
import formatName from "../functions/formatName";
import './VisualizeOrder.css';

const VisualizeOrder = ({ order }) => {
    // Convert the items object to an array of item objects with name included
    const orderItemsArray = Object.entries(order.items).map(([itemName, itemDetails]) => ({
        ...itemDetails,
        name: formatName(itemName), // Use your formatName function or adjust accordingly
    }));

    return (
        <div className="orderDetailsContainer">
            <div className="orderHeader">
                <h2>Order Details:</h2>
                {/* Display additional order information here */}
                <p>Order Date: {order.dateOrderGenerated}</p>
                <p>Comments: {order.comments}</p>
                <p>Subtotal: ${order.subtotal}</p>
            </div>
            {orderItemsArray.length > 0 ? (
                <div className="orderItemContainer">
                    {orderItemsArray.map((item, index) => (
                        <div key={index} className="orderItemCard">
                            {/* Assume an item image placeholder if not provided */}
                            <img 
                                src={item.imageURL || '/images/defaultFood.jpeg'}  
                                className="orderItemImage" 
                                alt={item.name} 
                            />
                            <div className='orderItemDetails'>
                                <h3 className="orderItemName">{item.name}</h3>
                                <p className="orderItemQuantity">Quantity: {item.batched ? (item.dozenQuantity > 0 ? item.dozenQuantity + " dozen" : item.halfDozenQuantity + " half dozen") : item.quantity}</p>
                                {/* Calculate price display based on batched or not */}
                                <p className="orderItemPrice">${
                                    item.batched ? 
                                    (item.dozenQuantity > 0 ? (item.dozenPrice * item.dozenQuantity) : (item.halfDozenPrice * item.halfDozenQuantity)) 
                                    : (item.price * item.quantity)
                                }</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <h2>This order is empty.</h2>
            )}
        </div>
    );
};


// VisualizeOrder.propTypes = {
//     item: PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         name: PropTypes.string.isRequired,
//         imageURL: PropTypes.string,
//         batched: PropTypes.bool.isRequired,
//         dozenQuantity: PropTypes.number,
//         halfDozenQuantity: PropTypes.number,
//         dozenPrice: PropTypes.number,
//         halfDozenPrice: PropTypes.number,
//         price: PropTypes.number,
//         quantity: PropTypes.number
//     }).isRequired,
//     handleQuantityChange: PropTypes.func,
//     quantityOptions: PropTypes.arrayOf(PropTypes.node),
//     isDozen: PropTypes.bool,
//     readOnly: PropTypes.bool // Indicates if the component is in read-only mode
// };

export default VisualizeOrder;