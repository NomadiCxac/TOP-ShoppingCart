import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './pageNavigation.css';
import './AdminPage.css'; // Import the CSS file
import { useFirebase } from '../context/FirebaseContext';
import { useFirebaseOrders } from '../hooks/useFirebaseOrders';
import Sidebar from '../components/Sidebar';
import { parse, format } from 'date-fns';
import SearchBar from '../components/SearchBar';
import AdminCurrentDateOrders from '../components/AdminCurrentDateOrders';

const AdminPage = () => {

    const { isAdmin, user } = useFirebase();
    const { retrieveOrderDataByMonth, retrieveOrdersByCurrentDate } = useFirebaseOrders()
    const location = useLocation(); 
    const [orderData, setOrderData] = useState([]);
    const [orderCountForMonth, setOrderCountForMonth] = useState(0)
    const [orderSubtotalForMonth, setOrderSubtotalForMonth] = useState(0)

    const currentDate = new Date();
    const currentMonthFormat = format(currentDate, "yyyy-MM");
    const currentMonthYearReadable = format(currentDate, "MMMM, yyyy");
    const currentDateReadable = format(currentDate, "EEEE, MMMM d, yyyy");

    useEffect(() => {
        const fetchData = async () => {

            const monthData = await retrieveOrderDataByMonth(currentMonthFormat);
            setOrderCountForMonth(monthData.orderCount)
            setOrderSubtotalForMonth(monthData.subtotalSum)

            let orders = await retrieveOrdersByCurrentDate();
            orders = sortOrdersByEarliestPickUpTime(orders);
            console.log("Sorted Orders:", orders); // Console log to inspect the sorted orders
            setOrderData(orders);
        };
        fetchData();

    }, []); // Run on mount


    const handleSearch = (searchTerm) => {
        console.log(`Searching for: ${searchTerm}`);
        // Implement your search logic here
    };

    useEffect(() => {
        document.body.style.overflowY = 'hidden';
        return () => {
          document.body.style.overflowY = 'auto';
        };
      }, [])

          // Notification Button Component
    const NotificationButton = () => (
        <button className="notificationButton">
            <span className="material-symbols-outlined">notifications</span>
        </button>
    );

    // Profile Display Component
    const ProfileDisplay = () => (
        <div className="profileDisplay">
            <img src={user.photoURL}className="profilePicture" />
            <span>{user.displayName}</span>
        </div>
    );

    const convertStartTimeToComparableValue = (pickUpTime) => {
        const startTime = pickUpTime.split(' - ')[0]; // Extracts "HH:mm" before the dash
        return startTime.replace(':', ''); // Removes the colon to make it a numeric value like "2100"
      };
      
      // Function to sort orders by the earliest pickup times
      const sortOrdersByEarliestPickUpTime = (orders) => {
        return orders.sort((a, b) => {
          const startTimeA = convertStartTimeToComparableValue(a.pickUpTime);
          const startTimeB = convertStartTimeToComparableValue(b.pickUpTime);
          return startTimeA - startTimeB; // For ascending order
        });
      };

    return (
        <div className="adminPageContainer">
            <Sidebar />
            <div className="mainContent">
                {location.pathname === '/adminPage'

                // Display admin dashboard default content
                    ? <div className='adminDashboard'>
                          <div className='topNav'>

                            <div className='topNavLeft'>
                                <div className='topNavTitle'>Overview</div>
                            </div>

                            <div className='topNavRight'>

                                <SearchBar onSearch={handleSearch} />

                                <div className='notificationContainer'>
                                    <NotificationButton />
                                </div>

                                <div className='adminProfile'>
                                    <ProfileDisplay />
                                </div>
                            </div>
  
                          </div>
                          <div className='pickupsOverviewContainer'>
                            <div className='pickupsOverviewTitle'>Orders for Pickup Today - {currentDateReadable}</div>
                            <div className='pickupsTodayContainer'>
                                <AdminCurrentDateOrders 
                                    ordersArray={orderData}
                                />
                            </div>
                          </div>
                          <div className='statisticsContainer'>
                            <div className='statCard'>
                                <div className='dataTitle'> 
                                    Orders Completed for {currentMonthYearReadable}
                                    <span className="material-symbols-outlined">shopping_cart_checkout</span>
                                </div>

                                <div className='dataValue'>
                                    {orderCountForMonth}
                                </div>
                               
           
                            </div>

                            <div className='statCard'>
                                <div className='dataTitle'> 
                                    Order Revenue for {currentMonthYearReadable}
                                    <span className="material-symbols-outlined">payments</span>
                                </div>

                                <div className='dataValue'>
                                    ${orderSubtotalForMonth.toFixed(2)} CAD
                                </div>
                            </div>
                          </div>
                      </div>

                    // Display content from other routed locations
                    : <Outlet />
                }
            </div>
        </div>
    );
};

export default AdminPage;