
const AdminCurrentDateOrders = ({ ordersArray }) => {
    return (
      <div>
        {ordersArray.map((order) => (
          <div className="orderCurrent" key={order.id} style={{ marginBottom: '20px' }}>
            <div>Order ID: {order.id}</div>
            <div>Customer Name: {order.name}</div>
            <div>Customer Email: {order.email}</div>
            <div>Customer Telephone: {order.phone}</div>
            <div>Order Subtotal: ${order.subtotal}</div>
            <button>View Order Details</button>
            <button>Order Picked Up</button>
          </div>
        ))}
      </div>
    );
  };

export default AdminCurrentDateOrders;
