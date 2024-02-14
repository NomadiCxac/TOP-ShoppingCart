import { useEffect, useState } from 'react';
import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { useFirebase } from '../context/FirebaseContext'; // Import the useFirebase hook
import OrderCard from './OrderCard';
import Modal from './Modal';
import TimeSelector from './TimeSelector';
import countItems from '../functions/countItems';
import formatName from '../functions/formatName';
import resolveImageUrl from '../functions/resolveImageUrl';
// import Carousel from './Carousel';
import './Modal.css';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user } = useFirebase(); // Use the useFirebase hook to access the current user
    const { retrieveOrdersByEmail } = useFirebaseOrders();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItemsArray, setOrderItemsArray] = useState([])
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


      const transformOrderItems = (order) => {
        if (!order || !order.items) return [];

        return Object.entries(order.items).map(([itemName, itemDetails]) => ({
            ...itemDetails,
            name: formatName(itemName), // Assuming formatName is a function that formats item names
            imageUrl: resolveImageUrl(itemDetails.id) // Assuming resolveImageUrl is a function that returns image URL
        }));
    };

    

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
        setOrderItemsArray(transformOrderItems(order))
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
                                <div className="orderSummary">
                                    <div className="orderIdContainer"> 
                                        <h3>Order Date: {selectedOrder.dateOrderGenerated}</h3>
                                    </div>

                                    <div className="orderConfirmationStatuses">
                                        <h5> Order Status: {selectedOrder.orderVerifiedStatus}</h5>
                                        <h5> Order Date: {selectedOrder.dateOrderGenerated}</h5>
                                    </div>


                                <div className="orderImages">
                                <div className="orderCardIconTitle">
                                <h6>{countItems(orderItemsArray)} item(s) - ${selectedOrder.subtotal} CAD</h6>
                                </div>
                                <div className="orderCardIconContainer">
                                {orderItemsArray.map((item) => (
                                <img className="orderCardIcon" key={item.id} src={resolveImageUrl(item.id)} alt={item.name} />
                                ))}
                                <TimeSelector
                                    selectedOrder = {selectedOrder}
                                />

                                </div>
                                </div>
                                {/* You can add a summary of the order here, like order status or total price */}
                                </div>
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
            </Modal>
            )}
        </div>
    );
};

export default UserDashboard;


