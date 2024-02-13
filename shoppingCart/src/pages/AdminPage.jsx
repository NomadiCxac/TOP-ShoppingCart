// import React from 'react';
import NavigationBar from '../components/NavigationBar';
import { Link } from 'react-router-dom';
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
        <button>
            <Link to="/setPickUpDates" className='clickableLink'>Set Calendar</Link>
        </button>
    </>
    
    )
}

export default AdminPage