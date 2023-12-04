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

    const addToCart = (item, userQuantity = 1, isDozen, isHalfDozen, isEdit = false) => {

        let defaultQuantity = 1;

        setCartItems(previousItems => {
            // Check if the item already exists in the cart
            let existingItemIndex = previousItems.findIndex(currentItem => currentItem.id === item.id);
            let updatedItems = [...previousItems];
    
            // Convert userQuantity to integer
            let quantity = parseInt(userQuantity, 10);
    
            if (existingItemIndex !== -1) {
                // If the item exists, update the quantity based on the flags
                let existingItem = {...updatedItems[existingItemIndex]};
    
                if (isEdit) {
                    // In edit mode, set the specific quantity type
                    if (isDozen) {
                        existingItem.dozenQuantity = quantity;
                    } else if (isHalfDozen) {
                        existingItem.halfDozenQuantity = quantity;
                    } else {
                        existingItem.quantity = quantity;
                    }
                } else {
                    // Not in edit mode, increment the specific quantity type
                    if (isDozen) {
                        existingItem.dozenQuantity += defaultQuantity;
                    } else if (isHalfDozen) {
                        existingItem.halfDozenQuantity += defaultQuantity;
                    } else {
                        existingItem.quantity += quantity;
                    }
                }
    
                updatedItems[existingItemIndex] = existingItem;
            } else {
                // If the item does not exist, add it with the specified quantity
                let newItem = {
                    ...item,
                    quantity: isDozen || isHalfDozen ? 0 : quantity,
                    halfDozenQuantity: isHalfDozen ? defaultQuantity : 0,
                    dozenQuantity: isDozen ? defaultQuantity : 0
                };
                updatedItems.push(newItem);
            }
    
            return updatedItems;
        });
    }

      const removeFromCart = (item) => {
        setCartItems(previousItems => {

            const updatedCart = previousItems.filter(currentItem => currentItem.id !== item.id);
            return updatedCart;
      });
    }

    return { cartItems, setCartItems, addToCart, removeFromCart };
}

export default useShoppingCart