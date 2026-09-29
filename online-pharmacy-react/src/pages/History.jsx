import { useState } from "react";
import { Link } from "react-router-dom";

function History() {

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("medicineHistory")) || []
  );

  // ================= FORMAT TIME =================

  const formatTime = (time) => {

    if (!time) return "";

    const [hours, minutes] = time.split(":");

    let hour = parseInt(hours);

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${String(hour).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // ================= CLEAR HISTORY =================

  const clearHistory = () => {

    if (window.confirm("Are you sure you want to clear medicine history?")) {

      setHistory([]);

      localStorage.removeItem("medicineHistory");
    }
  };

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
              to="/schedule"
              className="btn btn-custom"
            >
              📅 Schedule
            </Link>

          </div>

        </div>

      </nav>


      {/* ================= HISTORY SECTION ================= */}

      <section className="py-5">

        <div className="container">

          {/* ================= HEADING ================= */}

          <div className="text-center mb-5">

            <div className="register-icon">
              📊
            </div>

            <h1>
              Medicine History
            </h1>

            <p className="text-muted">
              Track your taken and missed medicines.
            </p>

          </div>


          {/* ================= EMPTY HISTORY ================= */}

          {history.length === 0 ? (

            <div className="card shadow-sm p-5 text-center">

              <div className="display-4 mb-3">
                📋
              </div>

              <h3>
                No medicine history
              </h3>

              <p className="text-muted">
                Your taken and missed medicines will appear here.
              </p>

              <Link
                to="/schedule"
                className="btn btn-primary mt-3"
              >
                📅 Go to Medicine Schedule
              </Link>

            </div>

          ) : (

            <>
              {/* ================= HISTORY HEADER ================= */}

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h3>
                  📋 Medicine Records
                </h3>

                <button
                  className="btn btn-outline-danger"
                  onClick={clearHistory}
                >
                  🗑️ Clear History
                </button>

              </div>


              {/* ================= HISTORY TABLE ================= */}

              <div className="card shadow-sm">

                <div className="table-responsive">

                  <table className="table table-hover mb-0">

                    <thead>

                      <tr>

                        <th>
                          Medicine
                        </th>

                        <th>
                          Date
                        </th>

                        <th>
                          Time
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {history.map((record) => (

                        <tr key={record.id}>

                          <td>

                            <strong>
                              💊 {record.medicine}
                            </strong>

                          </td>

                          <td>
                            {record.date}
                          </td>

                          <td>
                            {formatTime(record.time)}
                          </td>

                          <td>

                            {record.status === "Taken" ? (

                              <span className="badge bg-success">
                                ✅ Taken
                              </span>

                            ) : (

                              <span className="badge bg-danger">
                                ❌ Missed
                              </span>

                            )}

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </>
          )}


          {/* ================= BACK BUTTON ================= */}

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

export default History;