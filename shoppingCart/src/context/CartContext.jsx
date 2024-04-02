import { createContext, useContext } from 'react';
import useShoppingCart from '../hooks/useShoppingCart';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { cartItems, cartEmail, setCartEmail, setCartItems, addToCart, removeFromCart, clearCart } = useShoppingCart();

    return (
        <CartContext.Provider value={{ cartItems, cartEmail, setCartEmail, setCartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};