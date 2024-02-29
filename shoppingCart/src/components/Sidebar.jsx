import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import './Sidebar.css';

const Sidebar = () => {
    // Define a list of menu items for easier management and extension
    // Replace 'iconName' with the appropriate Material Symbol name for each item
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', iconName: 'space_dashboard', path: '' },
        { id: 'set-pickup-dates', label: 'Set Pickup Dates', iconName: 'calendar_month', path: '/setPickUpDates' },
        { id: 'order-searcher', label: 'Order Searcher', iconName: 'quick_reference_all', path: '/orderSearcher' },
        { id: 'payments-pending', label: 'Payments Pending', iconName: 'credit_card_gear', path: '/paymentsPending' },
        { id: 'set-order-ready', label: 'Set Order Ready', iconName: 'order_approve', path: '/setOrderReady' },
        { id: 'logout', label: 'Logout', iconName: 'logout', path: '/' }
    ];

    const { userSignOut} = useFirebase();

    const handleLogOut = async () => {
        await userSignOut(); // Wait for the sign-out process to complete
    };

    return (
        <div className="sidebarContainer">
            <div className='sideBarCompanyTitleContainer'>Kitchen on Selwyn Rd</div>
            <div className='menuNavContainer'>
                {menuItems.map((item) => (
                    <Link to={`/adminPage${item.path}`} key={item.id} className="sidebarNavContainer" id={`${item.id}`}>
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