import { Link, useLocation } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation(); 

    const adminActions = [
        { id: 'dashboard', label: 'Dashboard', iconName: 'space_dashboard', path: '/adminPage/' },
        { id: 'set-pickup-dates', label: 'Set Pickup Dates', iconName: 'calendar_month', path: '/adminPage/setPickUpDates' },
        { id: 'order-searcher', label: 'Order Summary', iconName: 'quick_reference_all', path: '/adminPage/orderSearcher' },
        { id: 'payments-pending', label: 'Set Payment Status', iconName: 'credit_card_gear', path: '/adminPage/paymentsPending' },
        { id: 'set-order-ready', label: 'Set Production Status', iconName: 'order_approve', path: '/adminPage/setOrderReady' },
        { id: 'logout', label: 'Logout', iconName: 'logout', path: '/' },
    ];

    const userActions = [
        { id: 'home', label: 'Home', iconName: 'home', path: '/' },
        { id: 'order-management', label: 'Order Management', iconName: 'orders', path: '/orderManagement' },
        { id: 'shoppingCart', label: 'Shopping Cart', iconName: 'shopping_cart', path: '/shoppingCartPage' },
    ];


    const { userSignOut} = useFirebase();

    const handleLogOut = async () => {
        await userSignOut(); // Wait for the sign-out process to complete
    };

    return (
        <div className="sidebarContainer">
            <div className='sideBarCompanyTitleContainer'>Kitchen on Selwyn Rd</div>
            <div className='menuNavContainer' id="adminActions">
                <div className='sectionTitle'>
                    Admin Actions
                </div>
                {adminActions.map((item) => (
                    <Link to={`${item.path}`} key={item.id}
                          className={`sidebarNavContainer ${location.pathname === item.path ? 'current' : ''}`} // Step 3: Conditional class application
                          id={`${item.id}`}>
                        <span className="material-symbols-outlined icon">
                            {item.iconName}
                        </span>
                        {item.label}
                    </Link>
                ))}
            </div>
            <div className='menuNavContainer' id="userActions">
                <div className='sectionTitle'>
                    Client Actions
                </div>
                {userActions.map((item) => (
                    <Link to={`${item.path}`} key={item.id}
                          className={`sidebarNavContainer ${location.pathname === item.path ? 'current' : ''}`} // Apply the same logic here
                          id={`${item.id}`}>
                        <span className="material-symbols-outlined icon">
                            {item.iconName}
                        </span>
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;