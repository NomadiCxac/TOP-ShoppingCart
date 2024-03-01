// useFirebaseOrders.js
import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { ref, push, set, get, update, query, orderByChild, equalTo, } from 'firebase/database';

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
        const safeEmail = validEmail(orderDetails.email);
    
        try {

            console.log(orderDetails)
            // Generate a unique location for the new order but don't set the data yet
            const newOrderRef = push(ordersRef); // This generates a new unique key
            const orderId = newOrderRef.key; // Extract the unique key generated by Firebase
    
            // Add the generated unique ID to the orderDetails object before saving it
            const updatedOrderDetails = { ...orderDetails, id: orderId };
    
            // Set the updated order details including the orderId in the database
            await set(newOrderRef, updatedOrderDetails);
    
            // Prepare updates for linking the order to the email
            const updates = {};
            const emailOrdersSnapshot = await get(ref(database, `ordersByEmail/${safeEmail}`));
    
            // If there are existing orders for the email, add to them, otherwise create a new list
            if (emailOrdersSnapshot.exists()) {
                updates[`ordersByEmail/${safeEmail}/${orderId}`] = orderId;
            } else {
                updates[`ordersByEmail/${safeEmail}`] = { [orderId]: orderId };
            }
    
            // Execute the updates for linking the order to the email
            await update(ref(database), updates);
    
            setOrders(prevOrders => [...prevOrders, updatedOrderDetails]);
            return orderId; // Return the orderId for any post-operation needs
        } catch (err) {
            setError(err.message);
            console.error("Error pushing to Firebase", err);
        } finally {
            setLoading(false);
        }
    };

    const setDateAndTimeForOrder = async (selectedOrder, pickUpDate, pickUpTime) => {
        setLoading(true);
        setError(null);

        if (!pickUpTime) {
            setError('Invalid Pickup Date');
            setLoading(false);
            return; // Exit the function early
        }

        const orderRef = ref(database, `orders/${selectedOrder.id}`);
        
        try {
            const snapshot = await get(orderRef)

            if (snapshot.exists()) {
                await update(orderRef, { pickUpDate: pickUpDate });
                await update(orderRef, { pickUpTime: pickUpTime });
            }
        } catch (error) {
            setError(error.message);
            console.error("Error retrieving orders by email:", error);
        } finally {
            setLoading(false);
        }

        return true;
    }

    
    const updateOrderPhase = async (selectedOrder, phase, status) => {
        setLoading(true);
        setError(null);

        if (!selectedOrder) {
            setError('Invalid Order Selection');
            setLoading(false);
            return; // Exit the function early
        }

        const orderPhaseRef = ref(database, `orders/${selectedOrder.id}`);
        
        try {
            console.log("this is being called")
            const snapshot = await get(orderPhaseRef)

            if (snapshot.exists()) {
                await update(orderPhaseRef, { orderPhase: phase });
                await update(orderPhaseRef, { orderVerifiedStatus: status });
            }
        } catch (error) {
            setError(error.message);
            console.error("Error updating order", error);
        } finally {
            setLoading(false);
        }

        return true;
    }

    const retrieveAllOrdersFromDatabase = async () => {

        let ordersRef = ref(database, `orders`)

        try {
            const snapshot = await get(ordersRef);
            if (snapshot.exists()) {
                const orderSnapshot = snapshot.val();
                const orderKeys = Object.keys(orderSnapshot);
                const ordersArray = orderKeys.map(key => {
                    return { ...orderSnapshot[key], id: key };
                });
                
                return ordersArray;
            } else {
                console.log("No orders found.");
            }
        } catch (error) {
            console.error("Error retrieving orders:", error);
        }
    };


    const retrieveOrderById = async (orderId) => {

        console.log(orderId)

        let ordersRef = ref(database, `orders/${orderId}`)

        try {
            const snapshot = await get(ordersRef);
            if (snapshot.exists()) {
                const orderData = snapshot.val();
                    return { ...orderData};
            } else {
                console.log("No orders found.");
            }
        } catch (error) {
            console.error("Error retrieving orders:", error);
            return [];
        }
    };


    const retrieveOrdersByPhase = async (phase) => {
        const ordersRef = ref(database, 'orders');
        const phaseQuery = query(ordersRef, orderByChild('orderPhase'), equalTo(phase));
    
        try {
            const snapshot = await get(phaseQuery);
            if (snapshot.exists()) {
                const orders = [];
                snapshot.forEach(orderSnapshot => {
                    orders.push({ id: orderSnapshot.key, ...orderSnapshot.val() });
                });
                return orders;
            } else {
                console.log("No orders found for phase:", phase);
                return [];
            }
        } catch (error) {
            console.error("Error retrieving orders by phase:", error);
            return [];
        }
    };
    

const retrieveOrdersByEmail = async (email, status = 'all') => {
    setLoading(true);
    setError(null);

    if (email === null || email === "") {
        return [];
    }

    try {
        const safeEmail = validEmail(email);

        console.log(email)
        const emailOrdersRef = ref(database, `ordersByEmail/${safeEmail}`);
        const snapshot = await get(emailOrdersRef);

        console.log(emailOrdersRef)

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
            return []; // Explicitly return an empty array when no orders are found
        }
    } catch (error) {
        setError(error.message);
        console.error("Error retrieving orders by email:", error);
        return []; // Explicitly return an empty array when no orders are found
    } finally {
        setLoading(false);
    }
};

    const validEmail = (email) => {
        let safe = email.replace(/\./g, '_');
        return safe;
    }


    const updatePickupTimesForDate = async (selectedDate, times) => {
        setLoading(true);
        setError(null);
        
        // Extract the month in 'MM_MonthName' format and the formatted date
        const yearMonth = `${selectedDate.getFullYear()}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}_${selectedDate.toLocaleString('default', { month: 'long' })}`;
        const day = selectedDate.getDate().toString();
        const formattedDate = `${yearMonth}/${day}`;
        
        // Define the paths for times and isPickUpDate at the day level, and pickUpDates at the month level
        const timesPath = `validPickUpDates/${formattedDate}/times`;
        const pickUpDateFlagPath = `validPickUpDates/${formattedDate}/isPickUpDate`;
        const pickUpDatesPath = `validPickUpDates/${yearMonth}/pickUpDates`;
    
        try {
            // Update the times array for the selected date
            await set(ref(database, timesPath), times);
    
            // Set the isPickUpDate flag based on whether any times are selected
            const isPickUpDate = times.length > 0;
            await set(ref(database, pickUpDateFlagPath), isPickUpDate);
    
            // Retrieve the current pickUpDates array for the month
            if (isPickUpDate) {
                const pickUpDatesRef = ref(database, pickUpDatesPath);
                const snapshot = await get(pickUpDatesRef);
                let pickUpDates = snapshot.exists() ? snapshot.val() : {};
    
                // Determine the next index for the new entry
                let nextIndex = Object.keys(pickUpDates).length;
    
                // Manually set the date at the next index
                pickUpDates[nextIndex] = day; // Adding the day as a new entry
    
                // Update the entire pickUpDates at once
                await set(pickUpDatesRef, pickUpDates);
            }
            
        
            // console.log(`Pickup times updated successfully with isPickUpDate set to ${isPickUpDate}.`);
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

        console.log(selectedDate)
    
        const formattedDate = `${selectedDate.getFullYear()}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}_${selectedDate.toLocaleString('default', { month: 'long' })}/${selectedDate.getDate()}`;
        const datePath = `validPickUpDates/${formattedDate}`;
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

    const getPickupDatesForMonth = async (year, month, index) => {
        setLoading(true);
        setError(null);
    
        // Format the monthPath similar to how you're storing it in Firebase
        const monthPath = `${year}/${index}${month}`;
        const pickUpDatesPath = `validPickUpDates/${monthPath}/pickUpDates`;
    
        try {
            const pickUpDatesRef = ref(database, pickUpDatesPath);
            const snapshot = await get(pickUpDatesRef);
            if (snapshot.exists()) {
                const pickUpDatesData = snapshot.val();
 
                return pickUpDatesData; 
            } else {
                return []; // Returns an empty array if no pickup dates are found
            }
        } catch (error) {
            console.error('Error fetching pickup dates:', error);
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
        setDateAndTimeForOrder,
        updateOrderPhase,
        retrieveAllOrdersFromDatabase,
        retrieveOrdersByPhase,
        retrieveOrderById,
        retrieveOrdersByEmail,
        updatePickupTimesForDate,
        getPickupTimesForDate,
        getPickupDatesForMonth
    };
};