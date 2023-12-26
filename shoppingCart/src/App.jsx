import './App.css';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/fireBaseOrders';
import AppRouter from './Router';
import useShoppingCart from './hooks/useShoppingCart';

function App() {
    const {cartItems, setCartItems, addToCart, removeFromCart} = useShoppingCart();

    return (
        <OrderProvider> {/* Wrap everything in OrderProvider */}
            <CartProvider>
                <AppRouter cartItems={cartItems} addToCart={addToCart} setCartItems={setCartItems} removeFromCart={removeFromCart} />
            </CartProvider>
        </OrderProvider>
    );
}

export default App;