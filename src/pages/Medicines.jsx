import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Medicines() {
  const [searchTerm, setSearchTerm] = useState("");

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/medicines")
      .then((response) => response.json())
      .then((data) => {
        setMedicines(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching medicines:", error);
        setLoading(false);
      });
  }, []);

  const filteredMedicines = medicines.filter((medicine) => {
    const search = searchTerm.toLowerCase();

    return (
      medicine.name.toLowerCase().includes(search) ||
      medicine.category.toLowerCase().includes(search) ||
      medicine.description.toLowerCase().includes(search)
    );
  });

  const getCartCount = () => {
    try {
      const items = JSON.parse(localStorage.getItem("orders")) || [];
      return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    } catch {
      return 0;
    }
  };

  const [cartCount, setCartCount] = useState(getCartCount);

  // ================= ADD TO ORDER =================

  const handleAddToOrder = (medicine) => {
    try {
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const medId = medicine._id || medicine.id;

      const existingIndex = existingOrders.findIndex(
        (item) => (item._id || item.id) === medId || item.name === medicine.name
      );

      let updatedQuantity = 1;
      if (existingIndex > -1) {
        existingOrders[existingIndex].quantity =
          (existingOrders[existingIndex].quantity || 1) + 1;
        updatedQuantity = existingOrders[existingIndex].quantity;
      } else {
        existingOrders.push({
          ...medicine,
          quantity: 1
        });
      }

      localStorage.setItem("orders", JSON.stringify(existingOrders));
      setCartCount(
        existingOrders.reduce((sum, item) => sum + (item.quantity || 1), 0)
      );

      alert(`${medicine.name} added to your order! (Quantity: ${updatedQuantity})`);
    } catch (error) {
      console.error("Error adding to order:", error);
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg">
        <div className="container">

          <Link className="navbar-brand" to="/dashboard">
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
              to="/orders"
              className="btn btn-custom"
            >
              🛒 My Orders
              {cartCount > 0 && (
                <span className="badge bg-danger ms-2">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>

        </div>
      </nav>

      {/* ================= MEDICINES ================= */}

      <section className="medicines-section py-5">

        <div className="container">

          <div className="text-center mb-5">

            <div className="register-icon">
              💊
            </div>

            <h1>Medicines</h1>

            <p className="text-muted">
              Search and find the healthcare products you need.
            </p>

          </div>

          {/* ================= SEARCH ================= */}

          <div className="medicine-search-box mb-5">

            <div className="input-group">

              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search medicines, vitamins, healthcare products..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

              <button
                className="btn btn-primary"
                type="button"
              >
                Search
              </button>

            </div>

          </div>

          {/* ================= COUNT ================= */}

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h3>
              Available Medicines
            </h3>

            <span className="text-muted">
              {filteredMedicines.length} products
            </span>

          </div>

          {/* ================= CARDS ================= */}

          <div className="row g-4">

            {filteredMedicines.length > 0 ? (

              filteredMedicines.map((medicine) => (

                <div
                  className="col-md-6 col-lg-4"
                  key={medicine.id}
                >

                  <div className="card h-100 shadow-sm medicine-card">

                    <div className="text-center pt-4">

                      <div className="medicine-icon">
                        {medicine.icon}
                      </div>

                    </div>

                    <div className="card-body d-flex flex-column">

                      <span className="text-muted small mb-2">
                        {medicine.category}
                      </span>

                      <h4 className="card-title">
                        {medicine.name}
                      </h4>

                      <p className="card-text text-muted">
                        {medicine.description}
                      </p>

                      <div className="mt-auto">

                        <h5 className="mb-3">
                          ₹{medicine.price}
                        </h5>

                        <button
                          className="btn btn-primary w-100"
                          onClick={() =>
                            handleAddToOrder(medicine)
                          }
                        >
                          🛒 Add to Order
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <div className="col-12">

                <div className="text-center py-5">

                  <div className="display-4">
                    🔍
                  </div>

                  <h4 className="mt-3">
                    No medicines found
                  </h4>

                  <p className="text-muted">
                    Try searching with a different medicine name.
                  </p>

                </div>

              </div>

            )}

          </div>

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

export default Medicines;