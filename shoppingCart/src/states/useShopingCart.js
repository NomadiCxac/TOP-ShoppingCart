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

    const addToCart = (item, userQuantity = 1, isDozen, isHalfDozen, isEdit = false,) => {
 
        setCartItems(previousItems => {
            let itemExistsInCart = false;
    
            const updatedCart = previousItems.map(currentItem => {
                if (currentItem.id === item.id) {
                    itemExistsInCart = true;
                    // Determine new quantity based on isEdit flag
                    let newQuantity = isEdit ? userQuantity : currentItem.quantity + userQuantity;
                    
                    // Update half dozen and dozen quantities if applicable
                    let newHalfDozenQuantity = currentItem.halfDozenQuantity || 0;
                    if (isHalfDozen) {
                        newHalfDozenQuantity += 1;
                    }
    
                    let newDozenQuantity = currentItem.dozenQuantity || 0;
                    if (isDozen) {
                        newDozenQuantity += 1;
                    }
    
                    return { 
                        ...currentItem, 
                        quantity: newQuantity, 
                        halfDozenQuantity: newHalfDozenQuantity, 
                        dozenQuantity: newDozenQuantity 
                    };
                }
                return currentItem;
            });
    
            if (itemExistsInCart) {
                return updatedCart;
            } else {
                // Add new item with appropriate quantities
                let newItem = {
                    ...item,
                    quantity: userQuantity,
                    halfDozenQuantity: isHalfDozen ? 1 : 0,
                    dozenQuantity: isDozen ? 1 : 0
                };
                return [...updatedCart, newItem];
            }
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