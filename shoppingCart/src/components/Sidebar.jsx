import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { signOutUser } from '../functions/signOutUser';
import './Sidebar.css';

const Sidebar = () => {
    const { user } = useFirebase();
    const location = useLocation();
    const navigate = useNavigate();

    const adminActions = [
        { id: 'dashboard', label: 'Dashboard', iconName: 'space_dashboard', path: '/adminPage' },
        { id: 'set-pickup-dates', label: 'Set Pickup Dates', iconName: 'calendar_month', path: '/adminPage/setPickUpDates' },
        { id: 'order-searcher', label: 'Order Searcher', iconName: 'quick_reference_all', path: '/adminPage/orderSearcher' },
        { id: 'payments-pending', label: 'Set Payment Status', iconName: 'credit_card_gear', path: '/adminPage/paymentsPending' },
        { id: 'set-order-ready', label: 'Set Production Status', iconName: 'order_approve', path: '/adminPage/setOrderReady' },
        { id: 'set-ordering-availability', label: 'Set Order Availability', iconName: 'tune', path: '/adminPage/setOrderingAvailability' },
        { id: 'logout', label: 'Logout', iconName: 'logout'},
    ];

    const userActions = [
        { id: 'home', label: 'Home', iconName: 'home', path: '/' },
        { id: 'order-management', label: 'Order Management', iconName: 'orders', path: '/orderManagement' },
        { id: 'shoppingCart', label: 'Shopping Cart', iconName: 'shopping_cart', path: '/shoppingCartPage' },
    ];


    const { userSignOut} = useFirebase();

    const handleLogOut = async () => {
        // Pass the necessary arguments to signOutUser function
        await signOutUser(user, userSignOut, navigate);
    };

    return (
        <div className="sidebarContainer">
            <div className='sideBarCompanyTitleContainer'>Kitchen on Selwyn Rd</div>
            <div className='menuNavContainer' id="adminActions">
                <div className='sectionTitle'>
                    Admin Actions
                </div>
                {adminActions.map((item) => {
                    if (item.id === 'logout') {
                        // Render a button or div for logout to handle click event
                        return (
                            <div key={item.id} className="sidebarNavContainer" onClick={handleLogOut}>
                                <span className="material-symbols-outlined icon">{item.iconName}</span>
                                {item.label}
                            </div>
                        );
                    } else {
                        // Other actions are handled as before
                        return (
                            <Link to={`${item.path}`} key={item.id}
                                  className={`sidebarNavContainer ${location.pathname === item.path ? 'current' : ''}`}
                                  id={`${item.id}`}>
                                <span className="material-symbols-outlined icon">{item.iconName}</span>
                                {item.label}
                            </Link>
                        );
                    }
                })}
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