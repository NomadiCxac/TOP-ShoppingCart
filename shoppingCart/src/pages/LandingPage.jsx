import React, {useState, useEffect} from "react";
import FoodMenu from "../components/FoodMenu";
import items from "../data/testData.js"

const LandingPage = () => {



    return (
    
    <div>
        <FoodMenu 
        items={items}
        />
    </div>
    
    )
}

export default LandingPage