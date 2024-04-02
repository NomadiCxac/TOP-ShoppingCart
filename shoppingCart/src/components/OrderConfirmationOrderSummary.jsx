import { useState } from "react"
import resolveImageUrl from "../functions/resolveImageUrl"
import formatName from "../functions/formatName"
import { calculateSubtotal } from "../functions/checkoutTotal"
import { checkoutItemTotal } from "../functions/checkoutTotal"

import './OrderConfirmationOrderSummary.css'

const OrderConfirmationOrderSummary = () => {
    const [orderData, setOrderData] = useState([{
        // Your initial object here
        batched: true,
        dozenPrice: 15,
        dozenQuantity: 1,
        halfDozenPrice: 10,
        halfDozenQuantity: 1,
        id: "chocolateCrinkleCookies",
        imageURL: "https://firebasestorage.googleapis.com/v0/b/kitchen-on-selwyn-rd.appspot.com/o/food%20menu%20icons%2FdefaultFood.jpeg?alt=media&token=9f76128c-2ba3-4bb7-87eb-c38f58ed7eeb",
        quantity: 0
    },

    {
        batched: true,
        dozenPrice: 15,
        dozenQuantity: 1,
        halfDozenPrice: 10,
        halfDozenQuantity: 1,
        id: "ensaymada",
        imageURL: "https://firebasestorage.googleapis.com/v0/b/kitchen-on-selwyn-rd.appspot.com/o/food%20menu%20icons%2FdefaultFood.jpeg?alt=media&token=9f76128c-2ba3-4bb7-87eb-c38f58ed7eeb",
        quantity: 0
    }
    
]);

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