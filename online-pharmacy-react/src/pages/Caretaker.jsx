import { useState } from "react";
import { Link } from "react-router-dom";

function Caretaker() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const addCaretaker = (e) => {
    e.preventDefault();

    setMessage(
      `${name} has been added as your caretaker.`
    );
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container">

          <Link className="navbar-brand" to="/dashboard">
            💊 Online Pharmacy
          </Link>

          <div className="ms-auto">
            <Link to="/dashboard" className="nav-link d-inline me-3">
              Dashboard
            </Link>

            <Link to="/medicines" className="btn btn-custom">
              Medicines
            </Link>
          </div>

        </div>
      </nav>

      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">

            <div className="register-icon">
              👨‍👩‍👧
            </div>

            <h1>Caretaker</h1>

            <p className="text-muted">
              Allow a trusted family member to monitor your
              medicine schedule.
            </p>

          </div>

          <div className="row justify-content-center">

            <div className="col-lg-6">

              <div className="card shadow-sm p-4">

                <h3 className="text-center mb-4">
                  👤 Add Caretaker
                </h3>

                <form onSubmit={addCaretaker}>

                  <div className="mb-3">

                    <label className="form-label">
                      Caretaker Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter caretaker name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />

                  </div>

                  <div className="mb-4">

                    <label className="form-label">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    👨‍👩‍👧 Add Caretaker
                  </button>

                </form>

                {message && (
                  <div className="alert alert-success mt-4">
                    ✅ {message}
                  </div>
                )}

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

      <footer className="text-center">
        <p>💊 Online Pharmacy & Medicine Reminder System</p>
        <p>© 2026 All Rights Reserved</p>
      </footer>
    </>
  );
}

export default Caretaker;