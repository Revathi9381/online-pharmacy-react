import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Schedule() {
  // ================= GET LOGGED-IN USER =================
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const userId = savedUser?.id;

  const [medicine, setMedicine] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("Once daily");

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ================= DEFAULT MEDICINES =================
  const defaultMedicines = [
    "Paracetamol",
    "Vitamin C",
    "Cough Syrup",
    "Multivitamin",
    "Antacid",
    "First Aid Cream",
    "Ibuprofen",
    "Cetirizine",
    "Omeprazole",
    "ORS Sachet",
    "Amoxicillin",
    "Azithromycin",
    "Antiseptic Solution",
    "Pain Relief Balm",
    "Calcium Tablets",
    "Iron Tablets",
    "Vitamin D3",
    "Nasal Spray",
    "Eye Drops",
    "Digital Thermometer"
  ];

  const [availableMedicines, setAvailableMedicines] =
    useState(defaultMedicines);

  // ================= FETCH MEDICINES =================
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/medicines"
        );

        if (res.ok) {
          const data = await res.json();

          if (Array.isArray(data) && data.length > 0) {
            const names = data.map((m) => m.name);
            setAvailableMedicines(names);
          }
        }
      } catch (err) {
        console.error(
          "Error fetching medicines:",
          err
        );
      }
    };

    fetchMedicines();
  }, []);

  // ================= FETCH USER SCHEDULES =================
  const fetchSchedules = async () => {
    try {
      setLoading(true);

      if (!userId) {
        console.error("No logged-in user found");
        setSchedules([]);
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/schedules?userId=${userId}`
      );

      const data = await res.json();

      if (res.ok) {
        setSchedules(data);
      } else {
        console.error(
          data.message || "Failed to fetch schedules"
        );
        setSchedules([]);
      }
    } catch (err) {
      console.error(
        "Error fetching schedules:",
        err
      );
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD SCHEDULES =================
  useEffect(() => {
    fetchSchedules();
  }, [userId]);

  // ================= FORMAT TIME =================
  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    const [hours, minutes] = timeStr.split(":");

    let hour = parseInt(hours, 10);

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${String(hour).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // ================= ADD SCHEDULE =================
  const handleAddSchedule = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login first.");
      return;
    }

    if (!medicine || !time) {
      alert("Please select a medicine and time.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(
        "http://localhost:5000/api/schedules",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            userId: userId,
            medicine: medicine,
            time: time,
            frequency: frequency,
            status: "Upcoming"
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Medicine schedule added successfully!");

        setSchedules((prev) => [
          ...prev,
          data.schedule
        ]);

        setMedicine("");
        setTime("");
        setFrequency("Once daily");
      } else {
        alert(
          data.message || "Failed to add schedule"
        );
      }
    } catch (err) {
      console.error(
        "Error creating schedule:",
        err
      );

      alert(
        "Unable to connect to server to add schedule"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE SCHEDULE =================
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this schedule?"
      )
    ) {
      return;
    }

    if (!userId) {
      alert("Please login first.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/schedules/${id}?userId=${userId}`,
        {
          method: "DELETE"
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSchedules((prev) =>
          prev.filter((schedule) => schedule._id !== id)
        );

        alert("Schedule removed successfully.");
      } else {
        alert(
          data.message || "Failed to delete schedule"
        );
      }
    } catch (err) {
      console.error(
        "Error deleting schedule:",
        err
      );

      alert(
        "Unable to connect to server to delete schedule"
      );
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
              to="/medicines"
              className="btn btn-custom"
            >
              💊 Medicines
            </Link>

          </div>

        </div>
      </nav>

      {/* ================= SCHEDULE SECTION ================= */}

      <section className="py-5">

        <div className="container">

          {/* ================= HEADING ================= */}

          <div className="text-center mb-5">

            <div className="register-icon">
              📅
            </div>

            <h1>
              Medicine Schedule
            </h1>

            <p className="text-muted">
              Set your medicine timings and manage your
              daily schedule.
            </p>

          </div>

          {/* ================= ADD SCHEDULE ================= */}

          <div className="card shadow-sm p-4 mb-5">

            <h3 className="mb-4">
              ➕ Add Medicine Schedule
            </h3>

            <form onSubmit={handleAddSchedule}>

              <div className="row g-4">

                {/* MEDICINE */}

                <div className="col-md-4">

                  <label className="form-label">
                    Medicine
                  </label>

                  <select
                    className="form-select"
                    value={medicine}
                    onChange={(e) =>
                      setMedicine(e.target.value)
                    }
                    required
                  >

                    <option value="">
                      Select medicine
                    </option>

                    {availableMedicines.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}

                  </select>

                </div>

                {/* TIME */}

                <div className="col-md-4">

                  <label className="form-label">
                    Medicine Time
                  </label>

                  <input
                    type="time"
                    className="form-control"
                    value={time}
                    onChange={(e) =>
                      setTime(e.target.value)
                    }
                    required
                  />

                </div>

                {/* FREQUENCY */}

                <div className="col-md-4">

                  <label className="form-label">
                    Frequency
                  </label>

                  <select
                    className="form-select"
                    value={frequency}
                    onChange={(e) =>
                      setFrequency(e.target.value)
                    }
                  >

                    <option value="Once daily">
                      Once daily
                    </option>

                    <option value="Twice daily">
                      Twice daily
                    </option>

                    <option value="Three times daily">
                      Three times daily
                    </option>

                    <option value="Every 8 hours">
                      Every 8 hours
                    </option>

                    <option value="Every 12 hours">
                      Every 12 hours
                    </option>

                  </select>

                </div>

              </div>

              {/* ADD BUTTON */}

              <div className="text-center mt-4">

                <button
                  type="submit"
                  className="btn btn-primary px-5"
                  disabled={submitting}
                >

                  {submitting
                    ? "Adding..."
                    : "➕ Add to Schedule"}

                </button>

              </div>

            </form>

          </div>

          {/* ================= TODAY'S SCHEDULE ================= */}

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h3>
              📅 Today's Medicine Schedule
            </h3>

            <div className="d-flex align-items-center gap-2">

              <span className="text-muted">
                {schedules.length} scheduled
              </span>

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={fetchSchedules}
              >
                🔄 Refresh
              </button>

            </div>

          </div>

          {/* ================= LOADING ================= */}

          {loading ? (

            <div className="card shadow-sm p-5 text-center">

              <div
                className="spinner-border text-primary mx-auto mb-3"
                role="status"
              >
              </div>

              <p className="text-muted mb-0">
                Loading medicine schedule from database...
              </p>

            </div>

          ) : schedules.length === 0 ? (

            /* ================= EMPTY ================= */

            <div className="card shadow-sm p-5 text-center">

              <div className="display-4 mb-3">
                📅
              </div>

              <h3>
                No medicines scheduled
              </h3>

              <p className="text-muted">
                Add a medicine and set its timing above.
              </p>

            </div>

          ) : (

            /* ================= SCHEDULE CARDS ================= */

            <div className="row g-4">

              {schedules.map((item) => (

                <div
                  className="col-md-6 col-lg-4"
                  key={item._id}
                >

                  <div className="card shadow-sm h-100">

                    <div className="card-body">

                      <div className="d-flex justify-content-between align-items-start">

                        <div>

                          <div className="medicine-icon mb-3">
                            💊
                          </div>

                          <h4>
                            {item.medicine}
                          </h4>

                        </div>

                        <span className="badge bg-success">
                          ⏰ {item.status || "Upcoming"}
                        </span>

                      </div>

                      <hr />

                      <p className="mb-2">

                        <strong>
                          🕐 Time:
                        </strong>{" "}

                        {formatTime(item.time)}

                      </p>

                      <p className="mb-3">

                        <strong>
                          🔄 Frequency:
                        </strong>{" "}

                        {item.frequency}

                      </p>

                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={() =>
                          handleDelete(item._id)
                        }
                      >
                        🗑️ Remove
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

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

export default Schedule;