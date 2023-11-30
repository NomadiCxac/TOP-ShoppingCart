import { useState, useEffect } from 'react';
import './FoodMenu.css'; // Make sure to import the CSS file
import fetchItems from '../functions/fetchItems';
import resolveImageUrl from '../functions/resolveImageUrl';
import { useCart } from '../context/CartContext';

const FoodMenu = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedOption, setSelectedVariant] = useState(null)

    const { addToCart } = useCart();

    function handleSelectedOption (option, item) {
        setSelectedItem(item);
        setSelectedVariant(option);
    }

    // I want to unrwap my item to map to this format: 
    // { item: {object}, itemImage: stringURL }
    useEffect (() => {
        setLoading(true);
        
        async function loadData () {
            try {
                const items = await fetchItems('items');
                const resolvedItems = items.map(item => ({...item, imageURL: resolveImageUrl(item.image)}))
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
                    <img className="menuItemImage" src={item.imageURL}
                         onError={(e) => e.currentTarget.src = '/images/defaultFood.jpeg'} 
                         alt={item.name} 
                    />
                    
                    {item.batched ? (
                <>
                    {/* Item details */}
                    <div className='priceContainer'>
                        <button onClick={() => handleSelectedOption('dozen', item)} className="price">One Dozen: ${item.dozenPrice.toFixed(2)} CAD</button>
                        <button onClick={() => handleSelectedOption('halfDozen', item)} className="price">Half a Dozen: ${item.halfDozenPrice.toFixed(2)} CAD</button>
                    </div>
                    <div className='buttonContainer'>

                        {selectedItem === item && selectedOption ? (
                            <button className="validSelector" onClick={() => addToCart(item, selectedOption === 'dozen' ? 12 : 6, selectedOption === 'dozen' ? true : false, selectedOption === 'dozen' ? false : true)}>
                                Add {selectedOption === 'dozen' ? 'a Dozen' : 'Half a Dozen'} to Cart
                            </button>
                            ) : (
                                <button className="invalidSelector" disabled={selectedItem && selectedItem !== item} onClick={() => console.log(`Please select an option first for ${item.name}`)}>
                                Please Select an Option 
                                </button>
                            )
                        } 
 

                    </div>
                </>
            ) :
                            (
                                <>
                                    <h3 className='menuItemName'>{item.name}</h3>
                                    <div className='priceContainer'>
                                        <span className="price">${item.price.toFixed(2)}</span>
                                    </div>
                                    <div className='buttonContainer'>
                                        <button>Add to Cart</button>
                                    </div>

                                </>
                            )
                        }

                        <p className='itemDescription'>{item.description}</p>

                </div>
            ))}
        </div>
    );
};

export default FoodMenu;