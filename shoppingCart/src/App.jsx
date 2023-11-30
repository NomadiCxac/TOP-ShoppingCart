
import './App.css'
import { CartProvider } from './context/CartContext'
import AppRouter from './Router'
import useShoppingCart from './states/useShopingCart'

function App() {
  const {cartItems, setCartItems, addToCart, removeFromCart} = useShoppingCart()

  return (
    <>
      <CartProvider >
        <AppRouter cartItems={cartItems} addToCart={addToCart} setCartItems={setCartItems} removeFromCart={removeFromCart} />
      </CartProvider>
    </>
  )
}

export default App