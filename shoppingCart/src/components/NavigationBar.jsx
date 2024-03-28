import {  useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import "./NavigationBar.css";
import { useFirebase } from '../context/FirebaseContext';


const NavigationBar = () => {

    const { cartItems } = useCart() 
    const { isAdmin, user } = useFirebase()
    const location = useLocation();
   
    let itemCount = 0;

    for (let item in cartItems) {


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

    const getLinkClass = (path) => {
        return `clickableLink ${location.pathname === path ? 'activeLink' : ''}`;
    };

    return (
        <div className="navBar">
            <div className='landingPageNavTitle'>
                <Link to="/" className={getLinkClass("/")}>Home</Link>
            </div>

            <div className='orderManagementNavTitle'>
                {user ? (
                    <Link to={{
                        pathname: "/userDashboard",
                        state: { user }
                      }} className={getLinkClass("/userDashboard")}>View Orders</Link>
                    ) : (
                    <Link to="/orderManagement" className={getLinkClass("/orderManagement")}>View Orders</Link>
                    )}
            </div>

            <div className='shoppingCartPageNavTitle'>
                <Link to="/shoppingCartPage" className={getLinkClass("/shoppingCartPage")}>Shopping Cart</Link>
                {itemCount > 0 && <span className="cartItemCount">{itemCount}</span>}
            </div>

            {isAdmin && 
                <div className='adminPageNavTitle'>
                <Link to="/adminPage" className={getLinkClass("/adminPage")}>Admin</Link>
            </div>}
        </div>
    );
};

export default NavigationBar;