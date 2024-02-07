import { useEffect, useState } from 'react';
import { useFirebaseOrders } from "../hooks/useFirebaseOrders";
import { useFirebase } from '../context/FirebaseContext'; // Import the useFirebase hook
import OrderCard from './OrderCard';
import Modal from './Modal';
import './UserDashboard.css';

const UserDashboard = () => {
    const { user } = useFirebase(); // Use the useFirebase hook to access the current user
    const { retrieveOrdersByEmail } = useFirebaseOrders();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

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
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <div className="orderDetailsModalContent">
                        <h3>Order Date: {selectedOrder.dateOrderGenerated}</h3>
                        {/* Render the selected order details */}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UserDashboard;