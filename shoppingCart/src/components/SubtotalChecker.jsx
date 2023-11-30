import { useCart } from "../context/CartContext";
import checkoutItemTotal from "../functions/checkoutTotal";
// import "./FinalizeShoppingCart.css"

const SubtotalChecker = () => {

    const { cartItems } = useCart()
    
    

    const subtotalCart = () => {

        let subtotal = 0;

        for (let item in cartItems) {
            subtotal += checkoutItemTotal(cartItems[item])
        }

        return subtotal
    }

    return (
    
    <div>
        {subtotalCart()}
    </div>
    )
}

export default SubtotalChecker;