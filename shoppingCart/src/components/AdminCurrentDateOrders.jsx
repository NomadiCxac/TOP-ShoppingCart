import './AdminCurrentDateOrders.css'

const AdminCurrentDateOrders = ({ ordersArray }) => {
    return (
      <div>
        {ordersArray.map((order) => (
          <div className="orderCurrent" key={order.id} style={{ marginBottom: '20px' }}>
            <div>{order.id}</div>
            <div>{order.name}</div>
            <div>{order.email}</div>
            <div>{order.phone}</div>
            <div>{order.pickUpTime}</div>
            <button className="viewOrderButton">View Order </button>
          </div>
        ))}
      </div>
    );
  };

export default AdminCurrentDateOrders;
