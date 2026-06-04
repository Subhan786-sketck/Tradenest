import React, { useEffect, useState } from "react";
import axios from "axios";
import BuyActionWindow from "./BuyActionWindow";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [showBuyWindow, setShowBuyWindow] = useState(false); // ✅ Add this

  // Fetch all orders
  const fetchOrders = () => {
    setLoading(true);
    axios
      .get("http://localhost:3002/orders")
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch orders");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Delete order function
  const deleteOrder = async (orderId, orderName) => {
    if (window.confirm(`Are you sure you want to delete order for ${orderName}?`)) {
      setDeletingId(orderId);
      try {
        await axios.delete(`http://localhost:3002/orders/${orderId}`);
        // Refresh the orders list after deletion
        fetchOrders();
      } catch (err) {
        console.error("Error deleting order:", err);
        setError("Failed to delete order");
        setDeletingId(null);
      }
    }
  };

  // ✅ Function to open buy window
  const handleGetStarted = () => {
    console.log("Get started clicked"); // Debug log
    setShowBuyWindow(true);
  };

  // ✅ Function to close buy window (will be passed as prop)
  const handleCloseBuyWindow = () => {
    setShowBuyWindow(false);
    // Refresh orders after placing order
    fetchOrders();
  };

  return (
    <div className="orders">
      <h2 className="title">Orders</h2>

      {/* ✅ Render BuyActionWindow when showBuyWindow is true */}
      {showBuyWindow && (
        <BuyActionWindow 
          uid="RELIANCE" 
          onClose={handleCloseBuyWindow}  // Pass close function
        />
      )}

      {error && (
        <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet</p>
          {/* ✅ Simple button with onClick - NOT to= */}
          <button onClick={handleGetStarted} className="btn">
            Get started
          </button>
        </div>
      ) : (
        <>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const total = (order.qty || 0) * (order.price || 0);
                  const isDeleting = deletingId === order._id;

                  return (
                    <tr key={order._id || index}>
                      <td>{order.name}</td>
                      <td className={order.mode === "BUY" ? "profit" : "loss"}>
                        {order.mode}
                      </td>
                      <td>{order.qty}</td>
                      <td>₹{Number(order.price || 0).toFixed(2)}</td>
                      <td>₹{total.toFixed(2)}</td>
                      <td>
                        {order.timestamp
                          ? new Date(order.timestamp).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        <button
                          onClick={() => deleteOrder(order._id, order.name)}
                          disabled={isDeleting}
                          style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            cursor: isDeleting ? "not-allowed" : "pointer",
                            fontSize: "12px"
                          }}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Optional: Order Summary */}
          <div className="order-summary" style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <h4>Order Summary</h4>
            <p>Total Orders: {orders.length}</p>
            <p>Total Investment: ₹{orders.reduce((sum, order) => sum + (order.qty || 0) * (order.price || 0), 0).toFixed(2)}</p>
            <p>BUY Orders: {orders.filter(o => o.mode === "BUY").length}</p>
            <p>SELL Orders: {orders.filter(o => o.mode === "SELL").length}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;