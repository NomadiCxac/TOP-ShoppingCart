import { useState } from "react";
import formatName from "../functions/formatName";
import './OrderItemView.css'

const OrderItemView = ({ items }) => {
    // Transform the items object into an array for mapping
    const initialItemsArray = Object.entries(items).map(([itemName, itemDetails]) => ({
      ...itemDetails,
      orderName: itemName, // Preserve the item name
      isPrepared: false, // Initialize 'isPrepared' state
    }));

    // Function to handle checkbox change
    const [itemsArray, setItemsArray] = useState(initialItemsArray);

    // Function to handle checkbox change
    const handleCheckboxChange = (index) => {
        // Create a new array with the updated item
        const newItemsArray = itemsArray.map((item, i) => {
            if(i === index) { // Find the item by its index
                return { ...item, isPrepared: !item.isPrepared }; // Toggle the 'isPrepared' state
            }
            return item;
        });

        // Update the itemsArray state with the new array
        setItemsArray(newItemsArray);
    };
    
  
    return (
      <>
        {itemsArray.map((item, index) => (
          <div key={index} className={`item-details ${item.isPrepared ? 'completed' : 'not-completed'}`}>
            <div className="item-header">
              <h5>{formatName(item.orderName)}:</h5>
              <label className="item-checkbox">
                <input 
                  type="checkbox" 
                  checked={item.isPrepared} 
                  onChange={() => handleCheckboxChange(index)} 
                />
                Complete
              </label>
            </div>
            <div className="item-body">
              {item.batched ? (
                <>
                  {item.halfDozenQuantity > 0 && <div>Box of 6 - Quantity: {item.halfDozenQuantity}</div>}
                  {/* Uncomment if prices should be shown */}
                  {/* {item.halfDozenPrice > 0 && <div>Half Dozen Price: ${item.halfDozenPrice}</div>} */}
                  {item.dozenQuantity > 0 && <div>Box of 12 - Quantity: {item.dozenQuantity}</div>}
                  {/* {item.dozenPrice > 0 && <div>Dozen Price: ${item.dozenPrice}</div>} */}
                </>
              ) : (
                <>
                  {item.quantity > 0 && <div>Quantity: {item.quantity}</div>}
                  {/* Uncomment if prices should be shown */}
                  {/* {item.price > 0 && <div>Price: ${item.price}</div>} */}
                </>
              )}
            </div>
          </div>
        ))}
      </>
    );
};

export default OrderItemView;