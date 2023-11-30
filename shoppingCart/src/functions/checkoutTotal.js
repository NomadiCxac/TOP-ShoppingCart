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

export default checkoutItemTotal