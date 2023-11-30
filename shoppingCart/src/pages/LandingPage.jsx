// import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import './pageNavigation.css'
// import FoodMenu from '../components/FoodMenu';
// import items from '../data/testData.js';

const LandingPage = () => {


    return (
    
    <>
        <NavigationBar/>
        <div className='pageContent'>
            <Outlet />
        </div>
      {/* This will render child routes */}
        {/* <FoodMenu /> */}
    </>
    
    )
}

export default LandingPage