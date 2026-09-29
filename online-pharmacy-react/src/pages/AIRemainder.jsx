import { Link } from "react-router-dom";

function AIReminder() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("AI Medicine Reminder has been set successfully!");
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
            <Link to="/dashboard" className="nav-link me-3">
              Dashboard
            </Link>

            <Link to="/medicines" className="btn btn-custom">
              Medicines
            </Link>
          </div>

        </div>
      </nav>

      {/* ================= AI REMINDER ================= */}
      <section className="py-5">

        <div className="container">

          <div className="text-center mb-5">

            <div className="register-icon">
              🎤
            </div>

            <h1>AI Medicine Reminder</h1>

            <p className="text-muted">
              Set smart reminders and never miss your medicine.
            </p>

          </div>

          <div className="row justify-content-center">

            <div className="col-lg-6 col-md-8">

              <div className="card shadow-sm p-4">

                <h3 className="text-center mb-4">
                  🔔 Set Your Reminder
                </h3>

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label className="form-label">
                      Medicine Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter medicine name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Dosage
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Example: 1 tablet"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Reminder Time
                    </label>

                    <input
                      type="time"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      Frequency
                    </label>

                    <select className="form-control" required>
                      <option value="">
                        Select frequency
                      </option>
                      <option value="once">
                        Once Daily
                      </option>
                      <option value="twice">
                        Twice Daily
                      </option>
                      <option value="three">
                        Three Times Daily
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    🎤 Set AI Reminder
                  </button>

                </form>

              </div>

            </div>

          </div>

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
          💊 Online Pharmacy & AI Medicine Reminder System
        </p>

        <p>
          © 2026 All Rights Reserved
        </p>

      </footer>
    </>
  );
}

export default AIReminder;