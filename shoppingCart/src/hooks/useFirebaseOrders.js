// useFirebaseOrders.js
import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { ref, push, get, update } from 'firebase/database';

export const useFirebaseOrders = () => {
    // Access database from context
    const { database } = useFirebase();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const pushOrderToDatabase = async (orderDetails) => {
        if (!orderDetails || !orderDetails.email) {
            setError('No items in the cart to order or email not provided.');
            setLoading(false);
            return; // Exit the function early
        }
    
        setLoading(true);
        setError(null);
    
        // Use the database instance from the context
        const ordersRef = ref(database, 'orders');
        const encodedEmail = encodeEmail(orderDetails.email);
        const emailOrdersRef = ref(database, `ordersByEmail/${encodedEmail}`);
    
        try {
            // First, check if there are any orders for the given email
            const emailOrdersSnapshot = await get(emailOrdersRef);
            
            // Push the new order to the 'orders' collection
            const newOrderRef = await push(ordersRef, orderDetails);
            const updates = {};
    
            // If there are existing orders for the email, add to them, otherwise create a new list
            if (emailOrdersSnapshot.exists()) {
                updates[`ordersByEmail/${encodedEmail}/${newOrderRef.key}`] = true;
            } else {
                updates[`ordersByEmail/${encodedEmail}`] = { [newOrderRef.key]: true };
            }
    
            // Update both 'orders' and 'ordersByEmail' in a single operation
            updates[`orders/${newOrderRef.key}`] = orderDetails;
            await update(ref(database), updates);
    
            setOrders(prevOrders => [...prevOrders, { ...orderDetails, id: newOrderRef.key }]);
            return newOrderRef.key;
        } catch (err) {
            setError(err.message);
            console.error("Error pushing to Firebase", err);
        } finally {
            setLoading(false);
        }
    };

    const retrieveOrdersFromDatabase = async () => {
        const ordersRef = ref(database, 'orders');
    
        try {
            const snapshot = await get(ordersRef);
            if (snapshot.exists()) {
                const orderSnapshot = snapshot.val();
                const orderKeys = Object.keys(orderSnapshot);
                const ordersArray = orderKeys.map(key => {
                    return { ...orderSnapshot[key], id: key };
                });
                
                console.log("Orders retrieved:", ordersArray);
                return ordersArray;
            } else {
                console.log("No orders found.");
            }
        } catch (error) {
            console.error("Error retrieving orders:", error);
        }
    };

const retrieveOrdersByEmail = async (email, status = 'all') => {
    setLoading(true);
    setError(null);

    try {
        const encodedEmail = encodeEmail(email);
        const emailOrdersRef = ref(database, `ordersByEmail/${encodedEmail}`);
        const snapshot = await get(emailOrdersRef);

        if (snapshot.exists()) {
            const orderKeys = Object.keys(snapshot.val());
            const orderPromises = orderKeys.map((key) => get(ref(database, `orders/${key}`)));

            // Retrieve all order details concurrently
            const orderSnapshots = await Promise.all(orderPromises);
            let ordersByEmail = orderSnapshots.map((snap) => snap.val());

            ordersByEmail = ordersByEmail.filter(order => {
                switch (status) {
                    case 'complete':
                        return order.orderComplete === true;
                    case 'incomplete':
                        return order.orderComplete === false;
                    case 'all':
                    default:
                        return true; // No filtering
                }
            });


            return ordersByEmail; // You might want to update state or return the value
        } else {
            console.log("No orders found for this email.");
        }
    } catch (error) {
        setError(error.message);
        console.error("Error retrieving orders by email:", error);
    } finally {
        setLoading(false);
    }
};

    function encodeEmail (email) {
        return btoa(email).replace(/[.]/g, ','); // Base64 encode and replace dots, as '.' is not allowed in Firebase keys
    }


    return {
        orders,
        loading,
        error,
        pushOrderToDatabase,
        retrieveOrdersFromDatabase,
        retrieveOrdersByEmail
    };
};