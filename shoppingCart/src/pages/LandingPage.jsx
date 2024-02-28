// import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import './pageNavigation.css'
import { useFirebase } from '../context/FirebaseContext';
// import FoodMenu from '../components/FoodMenu';
// import items from '../data/testData.js';

const LandingPage = () => {

    const location = useLocation(); // Get the current location

    const pathSegments = location.pathname.split('/');
    const pageId = pathSegments.length > 1 ? pathSegments[1] : 'landingPage';


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