import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Orders() {
  // Current cart / pending order items (from localStorage)
  const [pendingOrders, setPendingOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orders")) || [];
    } catch {
      return [];
    }
  });

  // Placed orders from MongoDB
  const [placedOrders, setPlacedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Fetch placed orders from backend
  const fetchPlacedOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/orders");
      if (response.ok) {
        const data = await response.json();
        setPlacedOrders(data);
      }
    } catch (error) {
      console.error("Error fetching placed orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:5000/api/orders")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (isMounted) {
          setPlacedOrders(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading placed orders:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update quantity of an item in cart
  const updateQuantity = (index, delta) => {
    const updated = [...pendingOrders];
    const newQty = (updated[index].quantity || 1) + delta;

    if (newQty <= 0) {
      removePendingOrder(index);
      return;
    }

    updated[index].quantity = newQty;
    setPendingOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // Remove item from pending cart
  const removePendingOrder = (index) => {
    const updated = pendingOrders.filter((_, i) => i !== index);
    setPendingOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // Place all cart items to MongoDB via POST /api/orders
  const handlePlaceOrder = async () => {
    if (pendingOrders.length === 0) return;

    try {
      setPlacingOrder(true);

      const itemsToSubmit = pendingOrders.map((item) => ({
        medicineId: item._id || item.id,
        medicineName: item.name,
        price: Number(item.price) || 0,
        quantity: item.quantity || 1,
        totalPrice: (Number(item.price) || 0) * (item.quantity || 1)
      }));

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(itemsToSubmit)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Order placed successfully into database!");
        localStorage.removeItem("orders");
        setPendingOrders([]);
        await fetchPlacedOrders();
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Unable to connect to server to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // Cancel an order from MongoDB via DELETE /api/orders/:id
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        alert("Order cancelled successfully");
        setPlacedOrders((prev) => prev.filter((order) => order._id !== orderId));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Unable to connect to server to cancel order");
    }
  };

  // Calculate cart total
  const cartTotal = pendingOrders.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  const cartItemsCount = pendingOrders.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/dashboard">
            💊 Online Pharmacy
          </Link>

          <div className="ms-auto d-flex align-items-center">
            <Link to="/dashboard" className="nav-link me-3">
              Dashboard
            </Link>

            <Link to="/medicines" className="btn btn-custom">
              💊 Browse Medicines
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= ORDERS / CART SECTION ================= */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <div className="register-icon">
              🛒
            </div>

            <h1>My Orders & Cart</h1>

            <p className="text-muted">
              Review your selected medicines, manage quantities, and place your order.
            </p>
          </div>

          {/* ================= SELECTED MEDICINES (CART) ================= */}
          {pendingOrders.length > 0 ? (
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>
                  🛍️ Selected Medicines ({cartItemsCount} item{cartItemsCount > 1 ? "s" : ""})
                </h3>

                <Link to="/medicines" className="btn btn-outline-primary btn-sm">
                  ➕ Add More Medicines
                </Link>
              </div>

              <div className="row g-4">
                {pendingOrders.map((medicine, index) => {
                  const itemPrice = Number(medicine.price) || 0;
                  const itemQty = medicine.quantity || 1;
                  const itemSubtotal = itemPrice * itemQty;

                  return (
                    <div className="col-md-6 col-lg-4" key={medicine._id || index}>
                      <div className="card h-100 shadow-sm">
                        <div className="text-center pt-4">
                          <div className="medicine-icon">
                            {medicine.icon || "💊"}
                          </div>
                        </div>

                        <div className="card-body d-flex flex-column">
                          <span className="text-muted small">
                            {medicine.category || "General"}
                          </span>

                          <h4 className="mt-2">
                            {medicine.name}
                          </h4>

                          <p className="text-muted small">
                            {medicine.description}
                          </p>

                          {/* Unit Price and Quantity Control */}
                          <div className="d-flex justify-content-between align-items-center my-3 p-2 bg-light rounded">
                            <div>
                              <small className="text-muted d-block">Unit Price</small>
                              <strong>₹{itemPrice}</strong>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-outline-secondary px-2"
                                onClick={() => updateQuantity(index, -1)}
                                title="Decrease quantity"
                              >
                                ➖
                              </button>

                              <span className="fw-bold px-2 fs-5">
                                {itemQty}
                              </span>

                              <button
                                className="btn btn-sm btn-outline-secondary px-2"
                                onClick={() => updateQuantity(index, 1)}
                                title="Increase quantity"
                              >
                                ➕
                              </button>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                            <span className="text-muted">Subtotal:</span>
                            <h5 className="mb-0 text-primary">₹{itemSubtotal}</h5>
                          </div>

                          <button
                            className="btn btn-outline-danger w-100 mt-3"
                            onClick={() => removePendingOrder(index)}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary Card */}
              <div className="card shadow-sm mt-4 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">Total Amount</h4>
                    <small className="text-muted">
                      {cartItemsCount} item{cartItemsCount > 1 ? "s" : ""} in order
                    </small>
                  </div>

                  <h3 className="mb-0 text-primary">
                    ₹{cartTotal}
                  </h3>
                </div>

                <button
                  className="btn btn-primary w-100 mt-4 py-2 fs-5"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                >
                  {placingOrder ? "Placing Order..." : "✅ Confirm & Place Order into Database"}
                </button>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm p-5 text-center mb-5">
              <div className="display-4 mb-3">
                🛒
              </div>

              <h3>No medicines in cart</h3>

              <p className="text-muted">
                You have not added any medicines to your current order yet.
              </p>

              <div>
                <Link to="/medicines" className="btn btn-primary mt-2">
                  💊 Browse & Add Medicines
                </Link>
              </div>
            </div>
          )}

          {/* ================= PLACED ORDERS (SAVED IN MONGODB) ================= */}
          <div className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>
                📋 Placed Orders History ({placedOrders.length})
              </h3>

              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={fetchPlacedOrders}
              >
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="card shadow-sm p-4 text-center">
                <div className="spinner-border text-primary mx-auto mb-2" role="status"></div>
                <p className="text-muted mb-0">Loading placed orders from database...</p>
              </div>
            ) : placedOrders.length === 0 ? (
              <div className="card shadow-sm p-4 text-center text-muted">
                No orders have been placed in the database yet.
              </div>
            ) : (
              <div className="row g-4">
                {placedOrders.map((order) => (
                  <div className="col-md-6 col-lg-4" key={order._id}>
                    <div className="card h-100 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small">
                            {order.medicineId?.category || "Healthcare"}
                          </span>

                          <span
                            className={`badge ${
                              order.status === "Delivered"
                                ? "bg-success"
                                : order.status === "Cancelled"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </div>

                        <h4 className="mt-1">
                          💊 {order.medicineName}
                        </h4>

                        <div className="my-2 p-2 bg-light rounded small">
                          <div className="d-flex justify-content-between">
                            <span>Unit Price:</span>
                            <span>₹{order.price}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Quantity:</span>
                            <strong>{order.quantity || 1}</strong>
                          </div>
                          <div className="d-flex justify-content-between mt-1 pt-1 border-top">
                            <strong>Total:</strong>
                            <strong className="text-primary">₹{order.totalPrice}</strong>
                          </div>
                        </div>

                        <div className="small text-muted mb-3">
                          {order.orderDate && (
                            <span>
                              📅 Placed on: {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto">
                          <button
                            className="btn btn-outline-danger btn-sm w-100"
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            🗑️ Cancel Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= BACK TO DASHBOARD ================= */}
          <div className="text-center mt-5">
            <Link to="/dashboard" className="btn btn-outline-primary">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center">
        <p>💊 Online Pharmacy & Medicine Reminder System</p>
        <p>© 2026 All Rights Reserved</p>
      </footer>
    </>
  );
}

export default Orders;