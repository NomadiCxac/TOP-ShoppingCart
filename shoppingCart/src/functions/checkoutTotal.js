const checkoutItemTotal = (item)=> {

    let price = 0;

    // multi Item Case
    if (item.batched) {

        let halfDozenCost = item.halfDozenQuantity * item.halfDozenPrice;
        let dozenCost = item.dozenQuantity * item.dozenPrice;
        price = halfDozenCost + dozenCost;

        return price;
    } 

    price = item.price * item.quantity;
    
    return price;
}

const checkoutItemQuantity = (item)=> {

    let quantity = 0;

    // multi Item Case
    if (item.batched) {
        return quantity += item.halfDozenQuantity + item.dozenQuantity ;
    } else {
        return quantity = item.quantity;
    }

}

const calculateSubtotal = (cartItems) => {
    return cartItems.reduce((total, item) => total + checkoutItemTotal(item), 0);
};

const calculateTotalItems = (cartItems) => {
    return cartItems.reduce((total, item) => total + checkoutItemQuantity(item), 0);
};

export { checkoutItemTotal, checkoutItemQuantity, calculateSubtotal, calculateTotalItems };