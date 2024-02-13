// useFirebaseOrders.js
import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { ref, push, set, get, update } from 'firebase/database';

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

    const encodeEmail = (email) => {
        return btoa(email).replace(/[.]/g, ','); // Base64 encode and replace dots, as '.' is not allowed in Firebase keys
    }

    const setValidPickupDatesAndTimes = async (startDate, endDate, newTimes) => {
        setLoading(true);
        setError(null);
    
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}_${date.toLocaleString('default', { month: 'long' })}/${date.getDate()}`;
            const timesPath = `validPickUpDates/${formattedDate}/times`;
            const pickUpDateFlagPath = `validPickUpDates/${formattedDate}/isPickUpDate`

            console.log(formattedDate)
    
            try {
                const timesRef = ref(database, timesPath);
                const flagRef = ref(database, pickUpDateFlagPath)
                const snapshot = await get(timesRef);
    
                let existingTimes = [];
                if (snapshot.exists()) {
                    existingTimes = snapshot.val();
                }
    
                // Merge newTimes with existingTimes, avoiding duplicates
                const updatedTimes = Array.from(new Set([...existingTimes, ...newTimes]));
    
                // Update the database with the merged array
                await set(flagRef, true)
                await set(timesRef, updatedTimes);
                console.log(`Pickup times set successfully for ${formattedDate}!`);
            } catch (error) {
                console.error(`Error setting valid pickup times for ${formattedDate}:`, error);
                setError(`Failed to set valid pickup times for ${formattedDate}.`);
                break; // Exit the loop on first error
            }
        }
    
        setLoading(false);
    };

    const updatePickupTimesForDate = async (selectedDate, times) => {
        setLoading(true);
        setError(null);
    
        const formattedDate = `${selectedDate.getFullYear()}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}_${selectedDate.toLocaleString('default', { month: 'long' })}/${selectedDate.getDate()}`;
        const timesPath = `validPickUpDates/${formattedDate}/times`;
        const pickUpDateFlagPath = `validPickUpDates/${formattedDate}/isPickUpDate`;
    
        try {
            // Update the times array
            await set(ref(database, timesPath), times);
    
            // Set the isPickUpDate flag based on whether any times are selected
            const isPickUpDate = times.length > 0;
            await set(ref(database, pickUpDateFlagPath), isPickUpDate);
    
            console.log(`Pickup times updated successfully with isPickUpDate set to ${isPickUpDate}.`);
        } catch (error) {
            console.error('Error updating pickup times:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getPickupTimesForDate = async (selectedDate) => {
        setLoading(true);
        setError(null);
    
        const formattedDate = `${selectedDate.getFullYear()}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}_${selectedDate.toLocaleString('default', { month: 'long' })}/${selectedDate.getDate()}`;
        const datePath = `validPickUpDates/${formattedDate}`;
        console.log(formattedDate)
        const pickUpDateFlagPath = `${datePath}/isPickUpDate`; // Path to check if the date is marked as a pickup date
    
        try {
            const dateFlagRef = ref(database, pickUpDateFlagPath);
            const flagSnapshot = await get(dateFlagRef);
            if (flagSnapshot.exists() && flagSnapshot.val() === true) {
                // If the isPickUpDate flag is true, proceed to fetch times
                const timesRef = ref(database, `${datePath}/times`);
                const timesSnapshot = await get(timesRef);
                const times = timesSnapshot.exists() ? timesSnapshot.val() || [] : [];
                return times; // Returns an array of times if available
            } else {
                return []; // Returns an empty array if the date is not marked as a pickup date
            }
        } catch (error) {
            console.error('Error fetching pickup times:', error);
            setError(error.message);
            return []; // Returns an empty array in case of an error
        } finally {
            setLoading(false);
        }
    };


    return {
        orders,
        loading,
        error,
        pushOrderToDatabase,
        retrieveOrdersFromDatabase,
        retrieveOrdersByEmail,
        setValidPickupDatesAndTimes,
        updatePickupTimesForDate,
        getPickupTimesForDate
    };
};