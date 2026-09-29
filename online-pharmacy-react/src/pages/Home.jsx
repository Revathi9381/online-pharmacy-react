import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">

          <Link className="navbar-brand" to="/">
            💊 Online Pharmacy
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menu"
            aria-controls="menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menu">
            <ul className="navbar-nav ms-auto align-items-lg-center">

              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/medicines">
                  Medicines
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/reminder">
                  AI Reminder
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/caretaker">
                  Caretaker
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>

              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                <Link to="/login" className="btn btn-custom">
                  Login
                </Link>
              </li>

              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center">

            <div className="col-md-6">
              <h2>💙 Your Digital Healthcare Partner</h2>

              <h3>
                Order medicines online, receive AI voice reminders,
                track your medicine intake, and let your family care
                from anywhere.
              </h3>

              <p>
                Manage medicines, receive smart reminders, track
                medicine intake and allow family members to monitor
                your medicine schedule — all in one platform.
              </p>

              <div className="mt-4">
                <Link
                  to="/login"
                  className="btn btn-primary btn-lg me-2"
                >
                  Get Started
                </Link>

                <Link
                  to="/medicines"
                  className="btn btn-custom btn-lg"
                >
                  💊 Explore Medicines
                </Link>
              </div>
            </div>

            <div className="col-md-6 text-center mt-4 mt-md-0">
              <img
                src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600"
                alt="Online Pharmacy Medicines"
                className="img-fluid rounded shadow"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="container py-5">

        <h2 className="text-center mb-2 fw-bold text-primary">
          Our Smart Healthcare Features
        </h2>

        <p className="text-center text-muted mb-5">
          Everything you need to manage medicines and healthcare
          in one place.
        </p>

        <div className="row g-4">

          {/* Online Pharmacy */}
          <div className="col-md-4">
            <Link
              to="/medicines"
              className="text-decoration-none text-dark"
            >
              <div className="card feature-card p-4 text-center h-100">

                <div className="feature-icon">💊</div>

                <h4>Online Pharmacy</h4>

                <p>
                  Search and explore medicines, health products
                  and wellness essentials.
                </p>

                <span className="text-primary fw-semibold">
                  Explore Medicines →
                </span>

              </div>
            </Link>
          </div>

          {/* AI Voice Reminder */}
          <div className="col-md-4">
            <Link
              to="/reminder"
              className="text-decoration-none text-dark"
            >
              <div className="card feature-card p-4 text-center h-100">

                <div className="feature-icon">🎤</div>

                <h4>AI Voice Reminder</h4>

                <p>
                  Get voice reminders so you never miss your
                  medicine schedule.
                </p>

                <span className="text-primary fw-semibold">
                  Try Reminder →
                </span>

              </div>
            </Link>
          </div>

          {/* Caretaker */}
          <div className="col-md-4">
            <Link
              to="/caretaker"
              className="text-decoration-none text-dark"
            >
              <div className="card feature-card p-4 text-center h-100">

                <div className="feature-icon">👨‍👩‍👧</div>

                <h4>Family Care</h4>

                <p>
                  Allow trusted family members to monitor medicine
                  intake.
                </p>

                <span className="text-primary fw-semibold">
                  Family Care →
                </span>

              </div>
            </Link>
          </div>

          {/* Medicine Schedule */}
          <div className="col-md-4">
            <Link
              to="/schedule"
              className="text-decoration-none text-dark"
            >
              <div className="card feature-card p-4 text-center h-100">

                <div className="feature-icon">📅</div>

                <h4>Medicine Schedule</h4>

                <p>
                  Organize your daily medicines according to time
                  and dosage.
                </p>

                <span className="text-primary fw-semibold">
                  Manage Schedule →
                </span>

              </div>
            </Link>
          </div>

          {/* Medicine History */}
          <div className="col-md-4">
            <Link
              to="/history"
              className="text-decoration-none text-dark"
            >
              <div className="card feature-card p-4 text-center h-100">

                <div className="feature-icon">📈</div>

                <h4>Medicine History</h4>

                <p>
                  Track your previous medicine intake and missed
                  doses.
                </p>

                <span className="text-primary fw-semibold">
                  View History →
                </span>

              </div>
            </Link>
          </div>

          {/* Smart Notifications */}
          <div className="col-md-4">
            <Link
              to="/reminder"
              className="text-decoration-none text-dark"
            >
              <div className="card feature-card p-4 text-center h-100">

                <div className="feature-icon">🔔</div>

                <h4>Smart Notifications</h4>

                <p>
                  Receive timely notifications for your medicine
                  schedule.
                </p>

                <span className="text-primary fw-semibold">
                  Set Reminder →
                </span>

              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* ================= ONLINE PHARMACY HIGHLIGHT ================= */}
      <section className="container py-5">

        <div className="row align-items-center">

          <div className="col-md-6">

            <h2 className="fw-bold">
              💊 Your Medicines, Just a Few Clicks Away
            </h2>

            <p className="mt-3 text-muted">
              Find medicines and healthcare products easily through
              our online pharmacy. Search, explore and add products
              to your shopping cart.
            </p>

            <Link
              to="/medicines"
              className="btn btn-primary mt-3"
            >
              🛒 Shop Medicines
            </Link>

          </div>

          <div className="col-md-6 mt-4 mt-md-0">

            <div className="p-4 rounded shadow-sm bg-white">

              <h5 className="fw-bold">
                🔍 Search for your medicine
              </h5>

              <div className="input-group mt-3">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search medicines..."
                />

                <Link
                  to="/medicines"
                  className="btn btn-primary"
                >
                  Search
                </Link>

              </div>

              <div className="mt-3">

                <small className="text-muted">
                  Popular:
                </small>

                <span className="badge bg-light text-dark ms-2">
                  Paracetamol
                </span>

                <span className="badge bg-light text-dark ms-1">
                  Vitamin C
                </span>

                <span className="badge bg-light text-dark ms-1">
                  First Aid
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="container py-5">

        <div className="text-center p-5 rounded-4 shadow-sm">

          <h2 className="fw-bold">
            Take Control of Your Medicine Routine 💙
          </h2>

          <p className="text-muted mt-3">
            Order medicines, manage your schedule, use AI reminders
            and stay connected with your family.
          </p>

          <Link
            to="/register"
            className="btn btn-primary btn-lg mt-3"
          >
            Create Your Account
          </Link>

        </div>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center">

        <h4>
          💊 Online Pharmacy & AI Medicine Reminder
        </h4>

        <p>
          Order. Track. Remind. Care.
        </p>

        <div className="mb-3">

          <Link
            to="/"
            className="text-decoration-none me-3"
          >
            Home
          </Link>

          <Link
            to="/medicines"
            className="text-decoration-none me-3"
          >
            Medicines
          </Link>

          <Link
            to="/reminder"
            className="text-decoration-none me-3"
          >
            AI Reminder
          </Link>

          <Link
            to="/caretaker"
            className="text-decoration-none me-3"
          >
            Caretaker
          </Link>

          <Link
            to="/contact"
            className="text-decoration-none"
          >
            Contact
          </Link>

        </div>

        <p>
          © 2026 Online Pharmacy. All Rights Reserved.
        </p>

      </footer>
    </>
  );
}

export default Home;