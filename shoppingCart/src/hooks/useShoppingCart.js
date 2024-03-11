import { useState, useEffect } from "react";


const useShoppingCart = () => {
    // Cart items state will be set to a function that retrieves the current shoppingCart state OR an empty shopping cart array
    const[cartItems, setCartItems] = useState(() => {
        let cartData = sessionStorage.getItem("shoppingCart");
        return cartData ? JSON.parse(cartData) : [];
    })

    useEffect(() => {
        sessionStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    }, [cartItems])

    const addToCart = (item, userQuantity = 1, isDozen, isHalfDozen, singular, isEdit = false) => {

        const maxQuantity = 10;

        let defaultQuantity = 1;

        setCartItems(previousItems => {
            // Check if the item already exists in the cart
            let existingItemIndex = previousItems.findIndex(currentItem => currentItem.id === item.id);
            let updatedItems = [...previousItems];
    
            // Convert userQuantity to integer
            let setQuantity = parseInt(userQuantity, 10);
    
            if (existingItemIndex !== -1) {
                // If the item exists, update the quantity based on the flags
                let existingItem = {...updatedItems[existingItemIndex]};
    
                if (isEdit) {
                    // In edit mode, set the specific quantity type
                    if (isDozen) {
                        existingItem.dozenQuantity = setQuantity;
                    } else if (isHalfDozen) {
                        existingItem.halfDozenQuantity = setQuantity;
                    } else {
                        existingItem.quantity = setQuantity;
                    }
                } else {
                    // Not in edit mode, increment the specific quantity type
                    if (isDozen) {
                        existingItem.dozenQuantity = Math.min(existingItem.dozenQuantity += defaultQuantity, maxQuantity);
                    } else if (isHalfDozen) {
                        existingItem.halfDozenQuantity = Math.min(existingItem.halfDozenQuantity + defaultQuantity, maxQuantity);
                    } else {
                        existingItem.quantity = Math.min(existingItem.quantity + defaultQuantity, maxQuantity);
                    }
                }
    
                updatedItems[existingItemIndex] = existingItem;
            } else {
                // If the item does not exist, add it with the specified quantity
                let newItem = {
                    ...item,
                    quantity: isDozen || isHalfDozen ? 0 : setQuantity,
                    halfDozenQuantity: isHalfDozen ? defaultQuantity : 0,
                    dozenQuantity: isDozen ? defaultQuantity : 0
                };
                updatedItems.push(newItem);
            }
    
            return updatedItems;
        });
    }

    const removeFromCart = (item, isDozen) => {
        setCartItems(previousItems => {
            return previousItems.reduce((acc, currentItem) => {
                if (currentItem.id === item.id) {
                    // If the item is batched, update the specific variant's quantity
                    if (currentItem.batched) {
                        if (isDozen) {
                            currentItem.dozenQuantity = 0;
                        } else {
                            currentItem.halfDozenQuantity = 0;
                        }
                        // If both quantities are not 0, keep the item
                        if (currentItem.dozenQuantity !== 0 || currentItem.halfDozenQuantity !== 0) {
                            acc.push(currentItem);
                        }
                    }
                    // If the item is not batched, remove it
                    else if (!currentItem.batched && !isDozen) {
                        // Do not add it back to the accumulator, effectively removing it
                    }
                } else {
                    // Keep all other items
                    acc.push(currentItem);
                }
                return acc;
            }, []);
        });
    };

    const clearCart = () => {
        setCartItems([]); // Set cartItems to an empty array to clear the cart
        sessionStorage.setItem('shoppingCart', JSON.stringify([])); // Also clear the shopping cart in sessionStorage
    };

    return { cartItems, setCartItems, addToCart, removeFromCart, clearCart };
}

export default useShoppingCart