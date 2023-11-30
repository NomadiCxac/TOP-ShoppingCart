import {  useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import "./NavigationBar.css";


const NavigationBar = () => {

    const { cartItems } = useCart() 
   
    let itemCount = 0;

    for (let item in cartItems) {


        console.log(cartItems[item]);

        if (cartItems[item].batched) {
            itemCount += (cartItems[item].halfDozenQuantity + cartItems[item].dozenQuantity)

        } else {
            itemCount += +(cartItems[item].quantity);
        }

    }

    useEffect(() => {
        const element = document.querySelector('.cartItemCount');
    
        if (element) {
            element.classList.add('animate');
    
            const timeout = setTimeout(() => {
                element.classList.remove('animate');
            }, 500); // Match this with the animation duration
    
            return () => clearTimeout(timeout);
        }
    }, [cartItems]);

        return (
            <div className="navBar">
                {/* Link to the home page */}
                <div className='landingPage'>
                    <Link to="/" className='clickableLink'>Home</Link>
                </div>
    
                {/* If you have routes for these, wrap them in Link as well */}
                <div className='shoppingCartPage'>
                    <Link to="/shoppingCartPage" className='clickableLink'>Shopping Cart</Link>
                    {itemCount > 0 && <span className="cartItemCount">{itemCount}</span>}
                </div>
            </div>
        );
    };

export default NavigationBar;