// import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { useLocation } from 'react-router-dom';
import './pageNavigation.css'
import { useFirebase } from '../context/FirebaseContext';
// import FoodMenu from '../components/FoodMenu';
// import items from '../data/testData.js';

const LandingPage = () => {

    const location = useLocation(); // Get the current location

    const pageId = location.pathname.substring(1) || 'landingPage';


    return (
    
    <>
        <NavigationBar/>
        <div className='pageContent' id={pageId}>
            <Outlet />
        </div>
      {/* This will render child routes */}
        {/* <FoodMenu /> */}
    </>
    
    )
}

export default LandingPage