import { createContext, useContext } from 'react';
import useShoppingCart from '../hooks/useShoppingCart';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { cartItems, setCartItems, addToCart, removeFromCart } = useShoppingCart();

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};