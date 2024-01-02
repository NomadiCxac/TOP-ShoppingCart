const OrderItemView = ({ items }) => {
    // Transform the items object into an array for mapping
    const itemsArray = Object.entries(items).map(([itemName, itemDetails]) => ({
      ...itemDetails,
      orderName: itemName // Preserve the item name
    }));
  
    return (
      <>
        {itemsArray.map((item, index) => (
          <div key={index} className="item-details">
            <h5>{item.orderName}:</h5>
            {item.batched ? (
              <>
                {item.halfDozenQuantity > 0 && <div>Half Dozen Quantity: {item.halfDozenQuantity}</div>}
                {item.halfDozenPrice > 0 && <div>Half Dozen Price: ${item.halfDozenPrice}</div>}
                {item.dozenQuantity > 0 && <div>Dozen Quantity: {item.dozenQuantity}</div>}
                {item.dozenPrice > 0 && <div>Dozen Price: ${item.dozenPrice}</div>}
              </>
            ) : (
              <>
                {item.quantity > 0 && <div>Quantity: {item.quantity}</div>}
                {item.price > 0 && <div>Price: ${item.price}</div>}
              </>
            )}
          </div>
        ))}
      </>
    );
  };

  export default OrderItemView;