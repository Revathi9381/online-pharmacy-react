import { useState } from "react";
import { Link } from "react-router-dom";

function Schedule() {
  const [medicine, setMedicine] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("Once daily");

  const [schedules, setSchedules] = useState([]);

  const medicines = [
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

  // ================= CONVERT TIME TO AM / PM =================

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

  // ================= ADD SCHEDULE =================

  const handleAddSchedule = (e) => {
    e.preventDefault();

    if (!medicine || !time) {
      alert("Please select a medicine and time.");
      return;
    }

    const newSchedule = {
      id: Date.now(),
      medicine: medicine,
      time: time,
      frequency: frequency
    };

    setSchedules([...schedules, newSchedule]);

    setMedicine("");
    setTime("");
    setFrequency("Once daily");
  };

  // ================= DELETE SCHEDULE =================

  const handleDelete = (id) => {
    const updatedSchedules = schedules.filter(
      (schedule) => schedule.id !== id
    );

    setSchedules(updatedSchedules);
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

          {/* HEADING */}

          <div className="text-center mb-5">

            <div className="register-icon">
              📅
            </div>

            <h1>
              Medicine Schedule
            </h1>

            <p className="text-muted">
              Set your medicine timings and manage your daily schedule.
            </p>

          </div>

          {/* ================= ADD SCHEDULE FORM ================= */}

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
                  >

                    <option value="">
                      Select medicine
                    </option>

                    {medicines.map((item) => (
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

                    <option>
                      Once daily
                    </option>

                    <option>
                      Twice daily
                    </option>

                    <option>
                      Three times daily
                    </option>

                    <option>
                      Every 8 hours
                    </option>

                    <option>
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
                >
                  ➕ Add to Schedule
                </button>

              </div>

            </form>

          </div>

          {/* ================= TODAY'S SCHEDULE ================= */}

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h3>
              📅 Today's Medicine Schedule
            </h3>

            <span className="text-muted">
              {schedules.length} scheduled
            </span>

          </div>

          {/* ================= EMPTY ================= */}

          {schedules.length === 0 ? (

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

            <div className="row g-4">

              {schedules.map((schedule) => (

                <div
                  className="col-md-6 col-lg-4"
                  key={schedule.id}
                >

                  <div className="card shadow-sm h-100">

                    <div className="card-body">

                      <div className="d-flex justify-content-between align-items-start">

                        <div>

                          <div className="medicine-icon mb-3">
                            💊
                          </div>

                          <h4>
                            {schedule.medicine}
                          </h4>

                        </div>

                        <span className="badge bg-success">
                          ⏰ Upcoming
                        </span>

                      </div>

                      <hr />

                      <p className="mb-2">

                        <strong>
                          🕐 Time:
                        </strong>{" "}

                        {formatTime(schedule.time)}

                      </p>

                      <p className="mb-3">

                        <strong>
                          🔄 Frequency:
                        </strong>{" "}

                        {schedule.frequency}

                      </p>

                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={() =>
                          handleDelete(schedule.id)
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