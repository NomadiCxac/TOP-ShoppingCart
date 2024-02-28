import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './pageNavigation.css';
import './AdminPage.css'; // Import the CSS file
import { useFirebase } from '../context/FirebaseContext';
import OrderList from '../components/OrderList';
import Sidebar from '../components/Sidebar';

const AdminPage = () => {
    const { isAdmin } = useFirebase();

    console.log(isAdmin);

    useEffect(() => {
        // Set overflow-y of the body to hidden when the component mounts
        document.body.style.overflowY = 'hidden';
        return () => {
          document.body.style.overflowY = 'auto';
        };
      }, [])

    return (
        <div className="adminPageContainer"> {/* Use the container class */}
            <Sidebar />
            <div className="mainContent"> {/* Class for the main content */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPage;