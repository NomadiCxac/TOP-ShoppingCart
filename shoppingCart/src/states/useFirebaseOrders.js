import { useState} from 'react';
import { getDatabase, ref, push } from 'firebase/database';

export const useFirebaseOrders = () => {
    // Define any states and functions here
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    const pushOrderToDatabase = async (cartItems) => {

        if (!cartItems || cartItems.length <= 0) {
            setError('No items in the cart to order.');
            setLoading(false);
            return; // Exit the function early
        }

        setLoading(true);
        setError(null)

        const db = getDatabase();
        const ordersRef = ref(db, '')

        const orderData = {
            ...cartItems,
        };

        try {
            const newOrderRef = await push(ordersRef, orderData);

            setOrders(prevOrder => [...prevOrder, { ...orderData, id: newOrderRef.key }]);
        } catch (err) {
            // Handle errors
            setError(err.message);
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