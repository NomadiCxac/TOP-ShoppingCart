import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

const ShoppingCartPage = () => {

const { cartItems } = useCart()

    let cartName = cartItems[0].name

    let cartQuantity = cartItems[0].quantity

    return (
    
    <div>
        Hello these are {cartName}, {cartQuantity}
        <Link to="/">
        You can go back to the home page by clicking here, though!
      </Link>    
    </div>
    
    )
}

export default ShoppingCartPage