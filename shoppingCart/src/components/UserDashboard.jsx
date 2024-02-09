import { useEffect, useState } from 'react';
import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { useFirebase } from '../context/FirebaseContext'; // Import the useFirebase hook
import OrderCard from './OrderCard';
import Modal from './Modal';
import Carousel from './Carousel';
import './Modal.css';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user } = useFirebase(); // Use the useFirebase hook to access the current user
    const { retrieveOrdersByEmail } = useFirebaseOrders();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [orderPhase, setOrderPhase] = useState(null)


    function formatDate(inputDate) {
        // Parse the input string into a Date object
        const date = new Date(inputDate);
      
        // Use toLocaleDateString to format the date as required
        // Specify the locale as 'en-US' and customize the format options
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC' // Ensure consistent behavior across different time zones
        });
      
        // Return the formatted date string
        return formattedDate;
      }

    

    useEffect(() => {
        if (user) {
            const loadOrders = async (status = "incomplete") => {
                setLoading(true);
                try {
                    const userEmail = user.email; // Directly use the user's email from the Firebase context
                    const fetchedOrders = await retrieveOrdersByEmail(userEmail, status);
                    setOrders(fetchedOrders || []); // Ensure fetchedOrders is an array
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            loadOrders();
        }
    }, [user]); // Depend on user to re-fetch orders if the user changes

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setModalOpen(true);
        setOrderPhase(order.orderPhase); // Update the orderPhase state based on the selected order's phase
        console.log(selectedOrder)
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error fetching orders: {error}</p>;

    return (
        <div className="userDashboardContainer">
            {orders.length > 0 ? (
                <div className="ordersContainer">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onClick={() => handleOpenModal(order)}
                        />
                    ))}
                </div>
            ) : (
                <p>You have no outstanding orders.</p>
            )}
            
            {selectedOrder && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} orientation={'top-right'}>

                    <div className='clientInteractionContainer'>
                        {orderPhase === 'step1' && (
                            <div className='contentContainer'>
                                <h2>Step 1: Awaiting Pick-Up Date Confirmation</h2>
                                <h3>Name Attached to Order: {selectedOrder.name}</h3>
                                <h3>Your Chosen Pick-Up Date: {formatDate(selectedOrder.date)}</h3>
                                <h3>Date Order Generated: {selectedOrder.dateOrderGenerated}</h3>
                                {/* Content specific to Step 1 */}
                            </div>
                        )}

                        {orderPhase === 'step2' && (
                            <div className='contentContainer'>
                                <h2>Step 2: Order Confirmed</h2>
                                <h3>Name Attached to Order: {selectedOrder.name}</h3>
                                <h3>Your Chosen Pick-Up Date: {formatDate(selectedOrder.date)}</h3>
                                <h3>Date Order Generated: {selectedOrder.dateOrderGenerated}</h3>
                                {/* Content specific to Step 2 */}
                            </div>
                        )}
                        {orderPhase === 'step3' && (
                            <div className='contentContainer'>
                                <h2>Step 3: In Progress</h2>
                                <h3>Name Attached to Order: {selectedOrder.name}</h3>
                                <h3>Your Chosen Pick-Up Date: {formatDate(selectedOrder.date)}</h3>
                                <h3>Date Order Generated: {selectedOrder.dateOrderGenerated}</h3>
                                {/* Content specific to Step 3 */}
                            </div>
                        )}
                        {orderPhase === 'step4' && (
                            <div className='contentContainer'>
                                <h2>Step 4: Ready for Pick-Up</h2>
                                <h3>Name Attached to Order: {selectedOrder.name}</h3>
                                <h3>Your Chosen Pick-Up Date: {formatDate(selectedOrder.date)}</h3>
                                <h3>Date Order Generated: {selectedOrder.dateOrderGenerated}</h3>
                                {/* Content specific to Step 4 */}
                            </div>
                        )}

                            <div className='closeButtonContainer'>
                                <p onClick={handleCloseModal} className="close-button" aria-label="Close modal">
                                    &times;
                                </p>
                            </div>
                    </div>

                <div className='carouselContainer'>
                    <div className='your-order-title'>
                        <h3>Your Order Subtotal: ${selectedOrder.subtotal}.00 CAD - Status: <span className={selectedOrder.clientPaid ? 'status-paid' : 'status-unpaid'}>
                            {selectedOrder.clientPaid ? 'Paid' : 'Unpaid'}
                            </span>
                        </h3>
                    </div>
                    <Carousel items={selectedOrder.items}></Carousel>
                </div>
            </Modal>
            )}
        </div>
    );
};

export default UserDashboard;


