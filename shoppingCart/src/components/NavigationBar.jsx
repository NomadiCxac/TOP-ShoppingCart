import {  useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import "./NavigationBar.css";
import { useFirebase } from '../context/FirebaseContext';


const NavigationBar = () => {

    const { cartItems } = useCart() 
    const { isAdmin, user } = useFirebase()
   
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

        return (
            <div className="navBar">
                {/* Link to the home page */}
                <div className='landingPageNavTitle'>
                    <Link to="/" className='clickableLink'>Home</Link>
                </div>

                <div className='orderManagementNavTitle'>
                {user ? (
                    <Link to={{
                        pathname: "/userDashboard",
                        state: { user }
                      }}>View Orders</Link>
                    ) : (
                    <Link to="/orderManagement" className='clickableLink'>View Orders</Link>
                    )}
                </div>
    
                {/* If you have routes for these, wrap them in Link as well */}
                <div className='shoppingCartPageNavTitle'>
                    <Link to="/shoppingCartPage" className='clickableLink'>Shopping Cart</Link>
                    {itemCount > 0 && <span className="cartItemCount">{itemCount}</span>}
                </div>

                { isAdmin && 
                    <div className='adminPageNavTitle'>
                    <Link to="/adminPage" className='clickableLink'>Admin</Link>
                </div> 
                }

            </div>
        );
    };

export default NavigationBar;