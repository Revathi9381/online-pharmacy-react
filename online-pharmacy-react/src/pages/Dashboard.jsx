import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <>
      {/* ================= NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg">
        <div className="container">

          {/* Logo */}

          <Link className="navbar-brand" to="/dashboard">
            💊 Online Pharmacy
          </Link>


          {/* Search */}

          <div className="dashboard-search d-none d-md-block">

            <input
              type="text"
              placeholder="🔍 Search medicines..."
            />

          </div>


          {/* Profile */}

          <div className="ms-3">

            <Link
              to="/profile"
              className="btn profile-btn"
            >
              👤 My Profile
            </Link>

          </div>

        </div>
      </nav>


      {/* ================= DASHBOARD ================= */}

      <section className="dashboard-section">

        <div className="container">


          {/* Welcome */}

          <div className="dashboard-welcome">

            <h1>
              Hello, <span id="userName">User</span> 👋
            </h1>

            <p>
              Welcome to your personal healthcare dashboard.
            </p>

          </div>


          {/* Mobile Search */}

          <div className="dashboard-mobile-search d-md-none mb-4">

            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search medicines..."
            />

          </div>


          {/* Quick Search */}

          <div className="dashboard-search-box">

            <h4>
              🔍 What are you looking for?
            </h4>

            <div className="input-group">

              <input
                type="text"
                className="form-control"
                placeholder="Search medicines, vitamins, healthcare products..."
              />

              <Link
                to="/medicines"
                className="btn btn-primary"
              >
                Search
              </Link>

            </div>

          </div>


          {/* ================= QUICK FEATURES ================= */}

          <h3 className="dashboard-title">
            My Healthcare
          </h3>


          <div className="row g-4">


            {/* Medicines */}

            <div className="col-md-4">

              <Link
                to="/medicines"
                className="dashboard-card-link"
              >

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    💊
                  </div>

                  <h4>
                    Medicines
                  </h4>

                  <p>
                    Search and order medicines online.
                  </p>

                  <span>
                    Explore →
                  </span>

                </div>

              </Link>

            </div>


            {/* AI Reminder */}

            <div className="col-md-4">

              <Link
                to="/reminder"
                className="dashboard-card-link"
              >

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    🎤
                  </div>

                  <h4>
                    AI Voice Reminder
                  </h4>

                  <p>
                    Never miss your medicine schedule.
                  </p>

                  <span>
                    Manage →
                  </span>

                </div>

              </Link>

            </div>


            {/* Caretaker */}

            <div className="col-md-4">

              <Link
                to="/caretaker"
                className="dashboard-card-link"
              >

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    👨‍👩‍👧
                  </div>

                  <h4>
                    Caretaker
                  </h4>

                  <p>
                    Let your family monitor your medicine intake.
                  </p>

                  <span>
                    Manage →
                  </span>

                </div>

              </Link>

            </div>


            {/* Schedule */}

            <div className="col-md-4">

              <Link
                to="/schedule"
                className="dashboard-card-link"
              >

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    📅
                  </div>

                  <h4>
                    Medicine Schedule
                  </h4>

                  <p>
                    Manage your daily medicine timings.
                  </p>

                  <span>
                    View Schedule →
                  </span>

                </div>

              </Link>

            </div>


            {/* History */}

            <div className="col-md-4">

              <Link
                to="/history"
                className="dashboard-card-link"
              >

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    📈
                  </div>

                  <h4>
                    Medicine History
                  </h4>

                  <p>
                    Track taken and missed medicines.
                  </p>

                  <span>
                    View History →
                  </span>

                </div>

              </Link>

            </div>


            {/* Orders */}

            <div className="col-md-4">

              <Link
                to="/orders"
                className="dashboard-card-link"
              >

                <div className="dashboard-card">

                  <div className="dashboard-icon">
                    🛒
                  </div>

                  <h4>
                    My Orders
                  </h4>

                  <p>
                    View your medicine orders and purchases.
                  </p>

                  <span>
                    View Orders →
                  </span>

                </div>

              </Link>

            </div>

          </div>


          {/* ================= PROFILE SUMMARY ================= */}

          <div className="profile-summary mt-5">

            <div>

              <h4>
                👤 Your Profile
              </h4>

              <p>
                Keep your personal information updated for a
                better healthcare experience.
              </p>

            </div>


            <Link
              to="/profile"
              className="btn btn-primary"
            >
              Edit Profile
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="text-center">

        <p>
          💊 Online Pharmacy & AI Medicine Reminder
        </p>

        <p>
          © 2026 All Rights Reserved
        </p>

      </footer>

    </>
  );
}

export default Dashboard;