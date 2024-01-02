import './App.css';
import { CartProvider } from './context/CartContext';
// import { OrderProvider } from './context/fireBaseOrders';
// import { AuthProvider } from './context/userAuthContext';
import { FirebaseProvider } from './context/FirebaseContext';
import AppRouter from './Router';
import useShoppingCart from './hooks/useShoppingCart';

function App() {
    const {cartItems, setCartItems, addToCart, removeFromCart} = useShoppingCart();

    return (
        <FirebaseProvider> 
                <CartProvider> 
                    <AppRouter 
                        cartItems={cartItems} 
                        addToCart={addToCart} 
                        setCartItems={setCartItems} 
                        removeFromCart={removeFromCart} 
                    />
                </CartProvider>
        </FirebaseProvider>
    );
}

export default App;