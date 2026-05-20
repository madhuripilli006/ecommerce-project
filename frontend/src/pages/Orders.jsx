import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!token) {
    return (
      <div className="container py-5 text-center">
        <h3 className="fw-bold">Please log in to view your orders</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Orders</h2>
        <span className="text-muted">{orders.length} orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">No orders found</div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div className="col-12 col-md-6 col-lg-4" key={order.id}>
              <div className="order-card h-100">
                <h4 className="fw-bold mb-3">Order #{order.id}</h4>
                <p className="mb-2">Total Amount: ₹ {order.total_amount}</p>
                <p className="mb-2">Status: {order.status}</p>
                <p className="mb-0 text-muted">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;