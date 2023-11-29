import React, { useState, useEffect } from 'react';
import './FoodMenu.css'; // Make sure to import the CSS file
import fetchItems from '../functions/fetchItems';
import fetchImage from '../functions/fetchImage';
import { useCart } from '../context/CartContext';

const FoodMenu = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { cartItems, setCartItems, addToCart } = useCart();

    // I want to unrwap my item to map to this format: 
    // { item: {object}, itemImage: stringURL }
    useEffect (() => {
        setLoading(true);
        
        async function loadData () {
            try {
                const items = await fetchItems('items');
                const resolvedItems = items.map(item => ({...item, imageURL: fetchImage(item.image)}))
                setFoodItems(resolvedItems);
            } catch (error) {
                setError(true);
                throw new error (`There was an error: ${error}`, error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return (
            <div>Error</div>
        )
    }

    return (
        <div className="food-menu">
            {foodItems.map((item) => (
                <div key={item.name} className="menu-item">
                    <img className="menuItemImage" src={item.imageURL}></img>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="price">${item.price}</span>
                    <button>Add to Cart</button>
                    {/* <input type="number" name="quantity" min="1" value="1"></input> */}
                    {item.halfDozen && 
                        <button onClick={() => addToCart(item, 6, item.price, false)}>Add Half a Dozen (+ 6)</button>
                    }
                    {item.dozen && 
                        <button onClick={() => addToCart(item, 12, item.price, false)}>Add a Dozen (+ 12)</button>
                    }
                </div>
            ))}
        </div>
    );
};

export default FoodMenu;