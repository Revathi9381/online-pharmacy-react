import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Medicines() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const medicines = [
    {
      id: 1,
      name: "Paracetamol",
      category: "Pain Relief",
      description: "Used for relief from pain and fever.",
      price: 25,
      icon: "💊",
    },
    {
      id: 2,
      name: "Vitamin C",
      category: "Vitamins",
      description: "Vitamin supplement for everyday health.",
      price: 120,
      icon: "🍊",
    },
    {
      id: 3,
      name: "Cough Syrup",
      category: "Cold & Cough",
      description: "Helps provide relief from cough symptoms.",
      price: 95,
      icon: "🧴",
    },
    {
      id: 4,
      name: "Multivitamin",
      category: "Vitamins",
      description: "Daily nutritional vitamin supplement.",
      price: 180,
      icon: "💙",
    },
    {
      id: 5,
      name: "Antacid",
      category: "Digestive Health",
      description: "For relief from acidity and indigestion.",
      price: 60,
      icon: "💊",
    },
    {
      id: 6,
      name: "First Aid Cream",
      category: "First Aid",
      description: "Cream for minor cuts and skin irritation.",
      price: 85,
      icon: "🩹",
    },
    {
      id: 7,
      name: "Ibuprofen",
      category: "Pain Relief",
      description: "Used for temporary relief from pain and inflammation.",
      price: 45,
      icon: "💊",
    },
    {
      id: 8,
      name: "Cetirizine",
      category: "Allergy",
      description: "Helps relieve common allergy symptoms.",
      price: 35,
      icon: "💊",
    },
    {
      id: 9,
      name: "Omeprazole",
      category: "Digestive Health",
      description: "Used to reduce excess stomach acid.",
      price: 70,
      icon: "💊",
    },
    {
      id: 10,
      name: "ORS Sachet",
      category: "Hydration",
      description: "Helps replace fluids and electrolytes.",
      price: 20,
      icon: "🥤",
    },
    {
      id: 11,
      name: "Amoxicillin",
      category: "Antibiotic",
      description: "Prescription antibiotic for certain bacterial infections.",
      price: 90,
      icon: "💊",
    },
    {
      id: 12,
      name: "Azithromycin",
      category: "Antibiotic",
      description: "Prescription antibiotic for certain bacterial infections.",
      price: 85,
      icon: "💊",
    },
    {
      id: 13,
      name: "Antiseptic Solution",
      category: "First Aid",
      description: "Used for cleaning minor cuts and wounds.",
      price: 75,
      icon: "🧴",
    },
    {
      id: 14,
      name: "Pain Relief Balm",
      category: "Pain Relief",
      description: "Topical balm for temporary relief from minor discomfort.",
      price: 55,
      icon: "🧴",
    },
    {
      id: 15,
      name: "Calcium Tablets",
      category: "Vitamins",
      description: "Calcium supplement for nutritional support.",
      price: 150,
      icon: "💊",
    },
    {
      id: 16,
      name: "Iron Tablets",
      category: "Vitamins",
      description: "Iron supplement for nutritional support.",
      price: 110,
      icon: "💊",
    },
    {
      id: 17,
      name: "Vitamin D3",
      category: "Vitamins",
      description: "Vitamin D supplement for everyday nutritional support.",
      price: 140,
      icon: "☀️",
    },
    {
      id: 18,
      name: "Nasal Spray",
      category: "Cold & Allergy",
      description: "Helps provide temporary relief from nasal congestion.",
      price: 130,
      icon: "💧",
    },
    {
      id: 19,
      name: "Eye Drops",
      category: "Eye Care",
      description: "Provides temporary relief from dry and irritated eyes.",
      price: 95,
      icon: "👁️",
    },
    {
      id: 20,
      name: "Digital Thermometer",
      category: "Healthcare Devices",
      description: "Digital device for checking body temperature.",
      price: 199,
      icon: "🌡️",
    },
  ];

  const filteredMedicines = medicines.filter((medicine) => {
    const search = searchTerm.toLowerCase();

    return (
      medicine.name.toLowerCase().includes(search) ||
      medicine.category.toLowerCase().includes(search) ||
      medicine.description.toLowerCase().includes(search)
    );
  });

  // ================= ADD TO ORDER =================

  const handleAddToOrder = (medicine) => {
    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    existingOrders.push(medicine);

    localStorage.setItem(
      "orders",
      JSON.stringify(existingOrders)
    );

    alert(`${medicine.name} added to your order.`);

    navigate("/orders");
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