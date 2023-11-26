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

    const addToCart = (item, userQuantity = 1, isEdit = false) => {
        setCartItems(previousItems => {

            let itemExistsInCart = false;

            const updatedCart = previousItems.map(currentItem => {
                if (currentItem.id === item.id) {
                    itemExistsInCart = true; // Set the flag to true if the item is found

                     // Update the quantity: if it's an edit, set to userQuantity; otherwise, add userQuantity
                    const newQuantity = isEdit ? userQuantity : currentItem.quantity + userQuantity;
                    return { ...currentItem, quantity: newQuantity }; // Update the quantity
                }
                return currentItem
            })

            if (itemExistsInCart) {
                return updatedCart; // If the item was found and updated, return the updated cart
            } else {
                return [...updatedCart, { ...item, quantity: userQuantity }]; // Add the new item to the cart
            }
        });
    }

      const removeFromCart = (item) => {
        setCartItems(previousItems => {

            const updatedCart = previousItems.filter(currentItem => currentItem.id !== item.id);
            return updatedCart;
      });
    }

    return { cartItems, addToCart, removeFromCart };
}

export default useShoppingCart