import { useCart } from "../context/CartContext";
import "./FinalizeShoppingCart.css"

const FinalizeShoppingCart = () => {

const { cartItems } = useCart()

    return (
    
    <div>
        {cartItems.map(item => (
            <>
                {item.batched && item.dozenQuantity > 0 &&
                    <div key={item.id + "-dozen"} className="cart-item">
                        <img 
                        src={item.imageURL}  
                        className="cart-item-image" 
                        onError={(e) => e.currentTarget.src = '/images/defaultFood.jpeg'} 
                        alt={item.name} 
                        />
                        <div className="cart-item-details">
                            <h3 className="cart-item-name">{item.name} (Box of 12)</h3>
                            <p className="cart-item-price">Price: ${item.dozenPrice.toFixed(2)}</p>
                            <p className="cart-item-quantity">Quantity: {item.dozenQuantity}</p>
                            {/* Add more details as needed */}
                        </div>
                    </div>
                }

                {item.batched && item.halfDozenQuantity > 0 &&
                    <div key={item.id + "-halfDozen"} className="cart-item">
                        <img 
                        src={item.imageURL}  
                        className="cart-item-image" 
                        onError={(e) => e.currentTarget.src = '/images/defaultFood.jpeg'} 
                        alt={item.name} 
                        />
                        <div className="cart-item-details">
                            <h3 className="cart-item-name">{item.name} (Box of 6)</h3>
                            <p className="cart-item-price">Price: ${item.halfDozenPrice.toFixed(2)}</p>
                            <p className="cart-item-quantity">Quantity: {item.halfDozenQuantity}</p>
                            {/* Add more details as needed */}
                        </div>
                    </div>
                }

                {!item.batched &&
                    <div key={item.id} className="cart-item">
                        <img 
                        src={item.imageURL}  
                        className="cart-item-image" 
                        onError={(e) => e.currentTarget.src = '/images/defaultFood.jpeg'} 
                        alt={item.name} 
                        />
                        <div className="cart-item-details">
                            <h3 className="cart-item-name">{item.name}</h3>
                            <p className="cart-item-price">Price: ${item.price.toFixed(2)}</p>
                            <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                            {/* Add more details as needed */}
                        </div>
                    </div>
                }
            </>
        ))}
    </div>
    )
}

export default FinalizeShoppingCart;