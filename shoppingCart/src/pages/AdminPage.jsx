// import React from 'react';
import NavigationBar from '../components/NavigationBar';
import './pageNavigation.css'
import { useFirebase } from '../context/FirebaseContext';
import OrderList from '../components/OrderList';
// import FoodMenu from '../components/FoodMenu';
// import items from '../data/testData.js';

const AdminPage = () => {

    const { isAdmin } = useFirebase()

    console.log(isAdmin);


    return (
    
    <>
        <OrderList />
    </>
    
    )
}

export default AdminPage