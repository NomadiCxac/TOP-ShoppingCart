// import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
// import FoodMenu from '../components/FoodMenu';
// import items from '../data/testData.js';

const LandingPage = () => {


    return (
    
    <div>
        <NavigationBar/>
        <Outlet /> {/* This will render child routes */}
        {/* <FoodMenu /> */}
    </div>
    
    )
}

export default LandingPage