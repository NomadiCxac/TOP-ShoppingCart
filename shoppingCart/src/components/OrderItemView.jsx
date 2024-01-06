import React from 'react';
import formatName from "../functions/formatName";
import './OrderItemView.css';

const OrderItemView = ({ items, preparedStatus, onItemPreparedToggle }) => {
    return (
        <>
            {Object.entries(items).map(([itemName, itemDetails]) => (
                <div key={itemName} className={`item-details ${preparedStatus[itemName] ? 'completed' : 'not-completed'}`}>
                    <div className="item-header">
                        <h5>{formatName(itemName)}:</h5>
                        <label className="item-checkbox">
                            <input 
                                type="checkbox" 
                                checked={!!preparedStatus[itemName]} 
                                onChange={() => onItemPreparedToggle(itemName)} 
                            />
                            Complete
                        </label>
                    </div>
                    <div className="item-body">
                        {itemDetails.batched ? (
                            <>
                                {itemDetails.halfDozenQuantity > 0 && <div>Box of 6 - Quantity: {itemDetails.halfDozenQuantity}</div>}
                                {itemDetails.dozenQuantity > 0 && <div>Box of 12 - Quantity: {itemDetails.dozenQuantity}</div>}
                            </>
                        ) : (
                            <>
                                {itemDetails.quantity > 0 && <div>Quantity: {itemDetails.quantity}</div>}
                            </>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default OrderItemView;