import { useState} from 'react';
import { app } from '../firebaseConfig';
import { getDatabase, ref, push } from 'firebase/database';

export const useFirebaseOrders = () => {
    // Define any states and functions here
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    const pushOrderToDatabase = async (orderDetails) => {

        if (!orderDetails) {
            setError('No items in the cart to order.');
            setLoading(false);
            return; // Exit the function early
        }

        setLoading(true);
        setError(null)

        const db = getDatabase(app);
        const ordersRef = ref(db, 'orders')

        const orderData = {
            ...orderDetails,
        };

        try {
            console.log("Pushing to Firebase", ordersRef, orderData);
            const newOrderRef = await push(ordersRef, orderData);
            console.log("Pushed to Firebase", newOrderRef);
            setOrders(prevOrder => [...prevOrder, { ...orderData, id: newOrderRef.key }]);
        } catch (err) {
            // Handle errors
            setError(err.message);
            console.error("Error pushing to Firebase", err);
        } finally {
            setLoading(false);
        }
    }
    

    return {
        orders,
        loading,
        error,
        pushOrderToDatabase,
    }
};

export default useFirebaseOrders;