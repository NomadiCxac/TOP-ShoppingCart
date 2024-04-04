import './CartDropdown.css'

const CartDropdown = ({ isVisible, item, onClose, imageURL, className }) => {
    if (!isVisible) return null;

    return (
        <div className={className}>
             <img className="cartDropdownImage" src={imageURL}
                         onError={(e) => e.currentTarget.src = '/images/defaultFood.jpeg'} 
                        //  alt={item.name} 
                    />
            <div className="cartItemDropdownDetails">
                {item.quantity} {item.name} has been added to your cart.
            </div>
            <p 
                className="close-button" 
                id="dropdown" 
                aria-label="Close modal"
                onClick={onClose}
            >
                &times;
            </p>
        </div>
    );
};

export default CartDropdown;