import { useState, useEffect, useRef } from 'react';

import CartDropdown from './CartDropdown';

import './FoodMenu.css'; // Make sure to import the CSS file
import fetchItems from '../functions/fetchItems';
import resolveImageUrl from '../functions/resolveImageUrl';
import getItemBaseName from '../functions/getBaseItemName';
import { useCart } from '../context/CartContext';

const FoodMenu = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [quantity, setQuantity] = useState(null);
    const [dropdownAnimation, setDropdownAnimation] = useState('exited'); // New state for animation
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const [recentlyAddedItem, setRecentlyAddedItem] = useState({});

    const { addToCart } = useCart();
    const mounted = useRef(true);

    useEffect(() => {
        console.log('FoodMenu Mounted');
        return () => {
            console.log('FoodMenu Unmounted');
        };
    }, []);

    useEffect(() => {
        document.title = 'Kitchen on Selwyn Rd';
        return () => clearTimeout(); // Logic to clear timeouts
      }, []);

      
    useEffect(() => {

        if (mounted.current) {
            return;
        }

        setDropdownAnimation('entering');
        setTimeout(() => {
            setDropdownAnimation('entered');
        }, 0); // Proceed to 'entered' state almost immediately

        // Schedule the exiting animation
        const hideTimeout = setTimeout(() => {
            setDropdownAnimation('exiting');
            setTimeout(() => {
                setDropdownAnimation('exited');
            }, 500); // Delay to match the exit animation duration
        }, 2500); // Time shown before starting the exit animation

        return () => clearTimeout(hideTimeout);
    }, [animationTrigger]);

    function handleSelectedOption (option, item) {
        setSelectedItem(item);
        setSelectedVariant(option);
    }

    function handleIndividualQuantities(e, item) {

        if (selectedItem && selectedItem !== item) {
            setQuantity(0);
        }

        setSelectedItem(item)
        setQuantity(e.target.value)
    }

    const handleAddToCart = (item, quantityOption, isDozen, isHalfDozen) => {

        setRecentlyAddedItem({});
        addToCart(item, quantityOption, isDozen, isHalfDozen);
    
        // Set details for the recently added item
        setRecentlyAddedItem({
            name: item.name,
            quantity: selectedVariant ? (selectedVariant== 'dozen' ? 'Box of 12' : 'Box of 6') : quantityOption,
            option: isDozen ? 'Dozen' : isHalfDozen ? 'Half-Dozen' : 'Single',
            imageURL: resolveImageUrl(item.image)
        });
        
        mounted.current = false
        setAnimationTrigger(prev => !prev);

        // Show the dropdown
        setSelectedItem(null);
        setSelectedVariant(null)
        setQuantity(null);
    };

    const quantityOptions = [];
    const maxQuantity = 10;
    for (let i = 1; i <= maxQuantity; i++) {
        quantityOptions.push(<option key={i} value={i}>{i}</option>);
    }


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
        <div id="food-menu">
            <CartDropdown
                  isVisible={dropdownAnimation !== 'exited'}
                  item={recentlyAddedItem}
                  onClose={() => setDropdownAnimation('exiting')} // Triggers exit animation
                  imageURL={recentlyAddedItem.imageURL}
                  className={`cartDropdown ${dropdownAnimation}`} //
            />
            {foodItems.map((item) => (
                <div key={item.name} className="menu-item">
                    <img className="menuItemImage" src={item.imageURL}
                         onError={(e) => e.currentTarget.src = '/images/defaultFood.jpeg'} 
                         alt={item.name} 
                    />

                    <div className='detailsContainer'>
                        <div className='menuItemName'>{item.name}</div>
                        {item.popular && (
                            <div className='bestSellerContainer'>
                                <span className="material-symbols-outlined">star</span>
                                <p className='popularItemText'>Best Seller</p>
                            </div>

                                ) 
                            }

                            <p className='itemDescription'>
                                {item.description}
                            </p>
                        
                        {item.batched ? (
                            <>
                                {/* Item details */}
                                <div className='optionContainer'>

                                <div className='nonDiscountContainer'>
                                    <button 
                                        onClick={() => handleSelectedOption('halfDozen', item)} 
                                        className={`option ${selectedItem === item && selectedVariant === 'halfDozen' ? 'selectedOption' : ''}`}
                                    >
                                        Box of 6: ${item.halfDozenPrice.toFixed(2)} CAD
                                    </button>
                                </div>

                                <div className='discountContainer'>

                                    <button 
                                        onClick={() => handleSelectedOption('dozen', item)} 
                                        className={`option ${selectedItem === item && selectedVariant === 'dozen' ? 'selectedOption' : ''}`}
                                    >
                                        Box of 12: ${item.dozenPrice.toFixed(2)} CAD
                                    </button>

                                    {item.discount && 
                                        <span className='discount'>
                                            {item.discount}% Off
                                            {/* <span className="material-symbols-outlined"> sell </span> */}
                                        </span>
                                    }

                                </div>
 

                                </div>
                                <div className='buttonContainer'>

                                    {selectedItem === item && selectedVariant ? (
                                        <button className="validSelector" 
                                            onClick={() => 
                                                handleAddToCart(
                                                    item, 
                                                    selectedVariant === 'dozen' ? 12 : 6, 
                                                    selectedVariant === 'dozen', 
                                                    selectedVariant !== 'dozen'
                                                    )}>
                                                Add to Cart
                                        </button>
                                        ) : (
                                        <button className="invalidSelector" disabled={selectedItem && selectedItem !== item}>
                                            Add to Cart 
                                        </button>
                                        )
                                    } 
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='optionContainer'>
                                    <span className="option">${item.price.toFixed(2)} per {getItemBaseName(item.name)}</span>
                                    
                                    <div className='selectContainer'>
                                        <label htmlFor={`${item.name}amount`}>Quantity:</label>
                                        <select
                                            id={`${item.name}amount`}
                                            value={selectedItem === item ? quantity || 0 : 0}
                                            onChange={(e) => handleIndividualQuantities(e, item)}
                                        >
                                        {/* Drop down select set at 0 */}
                                        <option value={0}> 0 </option>

                                        {/* Array of quantity options from 1 to 30 */}
                                        {quantityOptions}
                                        </select>
                                    </div>


                                </div>
                                
                                <div className='buttonContainer'>
                                    {selectedItem === item && quantity > 0 ? ( 
                                        <button className="validSelector" onClick={() => handleAddToCart(item, quantity, false, false)}>Add to Cart</button>
                                        ) : (
                                            <button className="invalidSelector" disabled={selectedItem && selectedItem !== item}>
                                                Add to Cart 
                                            </button>
                                        )}
                                </div>
                            </>
                                )
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FoodMenu;