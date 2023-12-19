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


export { checkoutItemTotal, checkoutItemQuantity }