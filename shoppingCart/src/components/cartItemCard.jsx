import PropTypes from 'prop-types';
import resolveImageUrl from '../functions/resolveImageUrl';
import './CartItemCard.css'


const CartItemCard = ({ item, handleQuantityChange, quantityOptions, isDozen }) => {
    // Determine the correct quantity based on the variant
    const currentQuantity = item.batched ? (isDozen ? item.dozenQuantity : item.halfDozenQuantity) : item.quantity

    console.log(item)

    return (
        <div className="cart-item" id={item.id}>
            <img 
                src={resolveImageUrl(item.image)}  
                className="cart-item-image" 
                onError={(e) => e.currentTarget.src = '/images/defaultFood.jpeg'} 
                alt={item.name} 
            />

            <div className='cart-item-details'>
                <div className="cart-item-info-container">
                    <h3 className="cart-item-name">{item.name} {item.batched ? (isDozen ? "(Box of 12)" : "(Box of 6)") : ""}</h3>
                    <p className="cart-item-price">${item.batched ? (isDozen ? (item.dozenPrice * item.dozenQuantity).toFixed(2) : (item.halfDozenPrice * item.halfDozenQuantity).toFixed(2)) : (item.price * item.quantity).toFixed(2)}</p>
                </div>
                
                <div className="cart-item-quantity-container">
                    <p className="cart-item-quantity">Quantity: {currentQuantity}</p>
                
                    <select 
                        className="quantity-input" 
                        value={currentQuantity}
                        onChange={(e) => handleQuantityChange(e, item, isDozen)}
                    >
                        <option value={0}>0 (Remove)</option>
                        {quantityOptions}
                    </select>
                </div>
            </div>
        </div>
    );
};

CartItemCard.propTypes = {
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string, 
      batched: PropTypes.bool.isRequired,
      dozenQuantity: PropTypes.number, // if batched
      halfDozenQuantity: PropTypes.number, // if batched 
      dozenPrice: PropTypes.number, // if batched
      halfDozenPrice: PropTypes.number, // if batched
      price: PropTypes.number,
      quantity: PropTypes.number
    }).isRequired,
    handleQuantityChange: PropTypes.func.isRequired,
    quantityOptions: PropTypes.arrayOf(PropTypes.node).isRequired,
    isDozen: PropTypes.bool.isRequired // Added isDozen in PropTypes
};

export default CartItemCard;