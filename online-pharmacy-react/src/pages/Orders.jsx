import { useState } from "react";
import { Link } from "react-router-dom";

function Orders() {

  // Get saved orders from localStorage
  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem("orders")) || []
  );

  // Remove medicine from order
  const removeOrder = (index) => {

    const updatedOrders = orders.filter(
      (_, i) => i !== index
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );
  };

  // Calculate total price
  const totalPrice = orders.reduce(
    (total, medicine) => total + medicine.price,
    0
  );

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg">

        <div className="container">

          <Link
            className="navbar-brand"
            to="/dashboard"
          >
            💊 Online Pharmacy
          </Link>

          <div className="ms-auto d-flex align-items-center">

            <Link
              to="/dashboard"
              className="nav-link me-3"
            >
              Dashboard
            </Link>

            <Link
              to="/medicines"
              className="btn btn-custom"
            >
              💊 Medicines
            </Link>

          </div>

        </div>

      </nav>


      {/* ================= ORDERS SECTION ================= */}

      <section className="py-5">

        <div className="container">

          {/* Heading */}

          <div className="text-center mb-5">

            <div className="register-icon">
              🛒
            </div>

            <h1>
              My Orders
            </h1>

            <p className="text-muted">
              View and manage your selected medicines.
            </p>

          </div>


          {/* ================= NO ORDERS ================= */}

          {orders.length === 0 ? (

            <div className="card shadow-sm p-5 text-center">

              <div className="display-4 mb-3">
                🛒
              </div>

              <h3>
                No orders yet
              </h3>

              <p className="text-muted">
                You have not added any medicines to your order yet.
              </p>

              <Link
                to="/medicines"
                className="btn btn-primary mt-3"
              >
                💊 Browse Medicines
              </Link>

            </div>

          ) : (

            <>
              {/* ================= ORDER ITEMS ================= */}

              <div className="row g-4">

                {orders.map((medicine, index) => (

                  <div
                    className="col-md-6 col-lg-4"
                    key={index}
                  >

                    <div className="card h-100 shadow-sm">

                      {/* Medicine Icon */}

                      <div className="text-center pt-4">

                        <div className="medicine-icon">
                          {medicine.icon}
                        </div>

                      </div>


                      {/* Medicine Details */}

                      <div className="card-body">

                        <span className="text-muted small">
                          {medicine.category}
                        </span>

                        <h4 className="mt-2">
                          {medicine.name}
                        </h4>

                        <p className="text-muted">
                          {medicine.description}
                        </p>

                        <h5>
                          ₹{medicine.price}
                        </h5>


                        {/* Remove Button */}

                        <button
                          className="btn btn-outline-danger w-100 mt-3"
                          onClick={() =>
                            removeOrder(index)
                          }
                        >
                          🗑️ Remove
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>


              {/* ================= ORDER SUMMARY ================= */}

              <div className="card shadow-sm mt-5 p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <h4 className="mb-0">
                    Total Amount
                  </h4>

                  <h3 className="mb-0">
                    ₹{totalPrice}
                  </h3>

                </div>


                <button
                  className="btn btn-primary w-100 mt-4"
                  onClick={() =>
                    alert("Order placed successfully!")
                  }
                >
                  ✅ Place Order
                </button>

              </div>

            </>

          )}


          {/* ================= BACK ================= */}

          <div className="text-center mt-5">

            <Link
              to="/dashboard"
              className="btn btn-outline-primary"
            >
              ← Back to Dashboard
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="text-center">

        <p>
          💊 Online Pharmacy & Medicine Reminder System
        </p>

        <p>
          © 2026 All Rights Reserved
        </p>

      </footer>

    </>
  );
}

export default Orders;