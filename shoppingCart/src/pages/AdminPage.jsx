import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './pageNavigation.css';
import './AdminPage.css'; // Import the CSS file
import { useFirebase } from '../context/FirebaseContext';
import Sidebar from '../components/Sidebar';

const AdminPage = () => {
    const { isAdmin } = useFirebase();
    const location = useLocation(); 

    console.log(isAdmin);

    useEffect(() => {
        document.body.style.overflowY = 'hidden';
        return () => {
          document.body.style.overflowY = 'auto';
        };
      }, [])

      return (
        <div className="adminPageContainer">
            <Sidebar />
            <div className="mainContent">
               
                {location.pathname === '/adminPage'
                    ? <div className='orderPickups Container'>
                          These are your outstanding orders
                      </div>
                    : <Outlet />
                }
            </div>
        </div>
    );
};

export default AdminPage;