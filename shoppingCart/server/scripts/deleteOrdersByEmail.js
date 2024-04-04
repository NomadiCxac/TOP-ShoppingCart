import admin from 'firebase-admin';
import serviceAccount from '../data/serviceAccount.js';

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kitchen-on-selwyn-rd-default-rtdb.firebaseio.com/"
});

const db = admin.database();

const userEmail = 'christianxavier.cordero@gmail.com'

const deleteOrdersByEmail = async (email) => {
    const ordersRef = db.ref('orders');
    try {
        const snapshot = await ordersRef.orderByChild('email').equalTo(email).once('value');
        const orders = snapshot.val();
        if (orders) {
            const promises = [];
            Object.keys(orders).forEach((orderId) => {
                const deletePromise = ordersRef.child(orderId).remove();
                promises.push(deletePromise);
                console.log(`Deleting order with ID: ${orderId}`);
            });
            await Promise.all(promises);
            console.log('All matching orders have been deleted successfully.');
        } else {
            console.log('No matching orders found.');
        }
    } catch (error) {
        console.error('Error deleting orders:', error);
    }
};


deleteOrdersByEmail(userEmail);