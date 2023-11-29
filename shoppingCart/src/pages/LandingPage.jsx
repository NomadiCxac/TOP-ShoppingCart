import React, {useState, useEffect} from "react";
import FoodMenu from "../components/FoodMenu";
import items from "../data/testData.js"
import NavigationBar from "../components/NavigationBar.jsx";

const LandingPage = () => {

    return (
    
    <div>
        <NavigationBar
        
        />
        <FoodMenu 
            items={items}
        />
    </div>
    
    )
}

export default LandingPage