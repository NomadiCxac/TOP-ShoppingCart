import { useState } from "react"
import resolveImageUrl from "../functions/resolveImageUrl"
import formatName from "../functions/formatName"
import { calculateSubtotal } from "../functions/checkoutTotal"
import { checkoutItemTotal } from "../functions/checkoutTotal"

import './OrderConfirmationOrderSummary.css'
import useShoppingCart from "../hooks/useShoppingCart"

const OrderConfirmationOrderSummary = () => {
    const { cartItems } = useShoppingCart()

    const orderData = cartItems;

    return (
        <div className="orderConfirmationSummary">
            {orderData.map((item) => (
                        <div className='orderItemContainer' id='orderRequestSent' key={item.id + "-orderReview"}>
                            <div className='orderItemContents' id='left'>
                                <img className="orderIcon" key={item.id} src={resolveImageUrl(item.id)} alt={formatName(item.id)} />
                                <div className='orderItemDescription' id='left'>
                                    <div className='nameOfItem'>
                                        {formatName(item.id)}
                                    </div>
                                    {item.dozenQuantity > 0 && (
                                        <div className='itemBreakdown' id='dozen'>
                                            {`Dozen ${formatName(item.id)} @ ${item.dozenQuantity} x ${item.dozenPrice.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                    {item.halfDozenQuantity > 0 && (
                                        <div className='itemBreakdown' id='halfDozen'>
                                            {`Half a Dozen ${formatName(item.id)} @ ${item.halfDozenQuantity} x ${item.halfDozenPrice.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                    {item.quantity > 0 && !item.batched && (
                                        <div className='itemBreakdown' id='singular'>
                                            {`${formatName(item.id)} @ ${item.quantity} x ${item.price.toFixed(2)} CAD`}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='orderItemContents' id='right'>
                                {checkoutItemTotal(item).toFixed(2) + " CAD"}
                            </div>
                            
                        </div>      
                    ))}

                {/* Divider */}
                <hr className="orderSummaryDivider" />

                
                <div className="orderSubtotal" id='orderRequestSent'>
                    <div>
                        Total:
                    </div>

                    <div>
                        ${calculateSubtotal(orderData).toFixed(2)} CAD 
                    </div>
                </div>
        </div>
    )
}



export default OrderConfirmationOrderSummary