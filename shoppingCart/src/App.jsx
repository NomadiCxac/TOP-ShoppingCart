import './App.css';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './path/to/OrderProvider'; // Import OrderProvider
import AppRouter from './Router';
import useShoppingCart from './states/useShopingCart';

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