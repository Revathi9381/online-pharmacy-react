import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

function Caretaker() {
  const [caretakers, setCaretakers] = useState([]);
  const [todayCareItems, setTodayCareItems] = useState([]);
  const [takenItems, setTakenItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingCare, setLoadingCare] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Get logged-in user
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = savedUser?.id;

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("Family Member");
  const [email, setEmail] = useState("");
  const [isEmergencyContact, setIsEmergencyContact] = useState(true);

  const [permissions, setPermissions] = useState({
    viewSchedule: true,
    viewOrders: true,
    receiveAlerts: true,
  });

  const [editingId, setEditingId] = useState(null);

  // ----------------------------------------------------
  // FETCH CARETAKERS
  // ----------------------------------------------------
  const fetchCaretakers = useCallback(async () => {
    if (!userId) {
      setCaretakers([]);
      setLoading(false);

      setMessage({
        text: "Please login to view caretakers.",
        type: "danger",
      });

      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/caretakers?userId=${userId}`
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        throw new Error(
          data.message || "Failed to load caretakers"
        );
      }

      const data = await res.json();

      setCaretakers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching caretakers:", err);

      setMessage({
        text: err.message || "Unable to connect to caretaker service.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ----------------------------------------------------
  // CREATE COMBINED CARE ITEMS
  // ----------------------------------------------------
  const createCareItems = (schedules, reminders) => {
    const combined = [];

    schedules.forEach((item) => {
      combined.push({
        id: `sched-${item._id}`,
        source: "Schedule",
        medicineName: item.medicine || "Medicine",
        dosage: item.dosage || "As scheduled",
        time: item.time,
        frequency: item.frequency || "Daily",
        notes: "Scheduled routine",
      });
    });

    reminders.forEach((item) => {
      combined.push({
        id: `rem-${item._id}`,
        source: "AI Reminder",
        medicineName: item.medicineName || "Medicine",
        dosage: item.dosage || "As prescribed",
        time: item.time,
        frequency: item.frequency || "Daily",
        notes: item.notes || "AI Voice reminder set",
      });
    });

    combined.sort((a, b) =>
      (a.time || "").localeCompare(b.time || "")
    );

    return combined;
  };

  // ----------------------------------------------------
  // FETCH TODAY'S CARE
  // ----------------------------------------------------
  const fetchTodayCare = useCallback(async () => {
    if (!userId) {
      setTodayCareItems([]);
      setLoadingCare(false);
      return;
    }

    try {
      setLoadingCare(true);

      const [scheduleRes, reminderRes] = await Promise.all([
        fetch(
          `http://localhost:5000/api/schedules?userId=${userId}`
        ),
        fetch(
          `http://localhost:5000/api/reminders?userId=${userId}`
        ),
      ]);

      const schedules = scheduleRes.ok
        ? await scheduleRes.json()
        : [];

      const reminders = reminderRes.ok
        ? await reminderRes.json()
        : [];

      const combined = createCareItems(
        Array.isArray(schedules) ? schedules : [],
        Array.isArray(reminders) ? reminders : []
      );

      setTodayCareItems(combined);
    } catch (err) {
      console.error("Error fetching today's care:", err);

      setMessage({
        text: "Unable to load today's care monitoring data.",
        type: "danger",
      });
    } finally {
      setLoadingCare(false);
    }
  }, [userId]);

  // ----------------------------------------------------
  // INITIAL LOAD
  // ----------------------------------------------------
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setLoadingCare(false);

      setMessage({
        text: "Please login to access Caretaker & Family Care.",
        type: "danger",
      });

      return;
    }

    fetchCaretakers();
    fetchTodayCare();
  }, [userId, fetchCaretakers, fetchTodayCare]);

  // ----------------------------------------------------
  // FORMAT TIME
  // ----------------------------------------------------
  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";

    const [hours, minutes] = timeStr.split(":");

    let hour = parseInt(hours, 10);

    if (Number.isNaN(hour)) {
      return timeStr;
    }

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${String(hour).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // ----------------------------------------------------
  // CHECK OVERDUE
  // ----------------------------------------------------
  const isTimeOverdue = (timeStr) => {
    if (!timeStr) return false;

    const [h, m] = timeStr.split(":").map(Number);

    if (Number.isNaN(h) || Number.isNaN(m)) {
      return false;
    }

    const now = new Date();

    const itemTime = new Date();

    itemTime.setHours(h, m, 0, 0);

    return now > itemTime;
  };

  // ----------------------------------------------------
  // TOGGLE TAKEN
  // ----------------------------------------------------
  const toggleTakenStatus = (itemId) => {
    setTakenItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // ----------------------------------------------------
  // RESET FORM
  // ----------------------------------------------------
  const resetForm = () => {
    setName("");
    setPhone("");
    setRelation("Family Member");
    setEmail("");
    setIsEmergencyContact(true);

    setPermissions({
      viewSchedule: true,
      viewOrders: true,
      receiveAlerts: true,
    });

    setEditingId(null);
  };

  // ----------------------------------------------------
  // CREATE / UPDATE CARETAKER
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage({
        text: "Please login before adding a caretaker.",
        type: "danger",
      });

      return;
    }

    if (!name.trim() || !phone.trim()) {
      setMessage({
        text: "Please provide both caretaker name and phone number.",
        type: "danger",
      });

      return;
    }

    try {
      setSubmitting(true);

      setMessage({
        text: "",
        type: "",
      });

      const payload = {
        userId,
        name: name.trim(),
        phone: phone.trim(),
        relation,
        email: email.trim(),
        isEmergencyContact,
        permissions,
      };

      let res;

      if (editingId) {
        // UPDATE
        res = await fetch(
          `http://localhost:5000/api/caretakers/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // CREATE
        res = await fetch(
          "http://localhost:5000/api/caretakers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({
          text: editingId
            ? "Caretaker details and permissions updated successfully!"
            : `${payload.name} has been added as caretaker!`,
          type: "success",
        });

        resetForm();

        await fetchCaretakers();
      } else {
        setMessage({
          text: data.message || "Failed to save caretaker.",
          type: "danger",
        });
      }
    } catch (err) {
      console.error("Error saving caretaker:", err);

      setMessage({
        text: "Unable to connect to server.",
        type: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // EDIT CARETAKER
  // ----------------------------------------------------
  const handleStartEdit = (caretaker) => {
    setEditingId(caretaker._id);

    setName(caretaker.name || "");
    setPhone(caretaker.phone || "");

    setRelation(
      caretaker.relation || "Family Member"
    );

    setEmail(caretaker.email || "");

    setIsEmergencyContact(
      caretaker.isEmergencyContact !== false
    );

    setPermissions(
      caretaker.permissions || {
        viewSchedule: true,
        viewOrders: true,
        receiveAlerts: true,
      }
    );

    setMessage({
      text: `Editing details and permissions for ${caretaker.name}`,
      type: "info",
    });

    window.scrollTo({
      top: 120,
      behavior: "smooth",
    });
  };

  // ----------------------------------------------------
  // DELETE CARETAKER
  // ----------------------------------------------------
  const handleDelete = async (id) => {
    if (!userId) {
      setMessage({
        text: "Please login before deleting a caretaker.",
        type: "danger",
      });

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove this caretaker?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/caretakers/${id}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({
          text: "Caretaker removed successfully.",
          type: "success",
        });

        setCaretakers((prev) =>
          prev.filter((c) => c._id !== id)
        );

        if (editingId === id) {
          resetForm();
        }
      } else {
        setMessage({
          text: data.message || "Failed to delete caretaker.",
          type: "danger",
        });
      }
    } catch (err) {
      console.error("Error deleting caretaker:", err);

      setMessage({
        text: "Unable to connect to server.",
        type: "danger",
      });
    }
  };

  // ----------------------------------------------------
  // MISSED DOSES
  // ----------------------------------------------------
  const missedDoseItems = todayCareItems.filter(
    (item) =>
      !takenItems[item.id] &&
      isTimeOverdue(item.time)
  );

  // ----------------------------------------------------
  // EMERGENCY CONTACT
  // ----------------------------------------------------
  const emergencyCaretaker =
    caretakers.find(
      (c) => c.isEmergencyContact
    ) ||
    caretakers[0] ||
    null;

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
              className="nav-link me-3"
            >
              📅 Schedule
            </Link>

            <Link
              to="/medicines"
              className="btn btn-custom"
            >
              Medicines
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= CARETAKER SECTION ================= */}

      <section className="py-5">
        <div className="container">

          {/* HEADER */}

          <div className="text-center mb-4">
            <div className="register-icon">
              👨‍👩‍👧
            </div>

            <h1>
              Caretaker & Family Care
            </h1>

            <p className="text-muted">
              Allow trusted family members to monitor medicine schedules,
              receive missed dose alerts, and manage emergency contacts.
            </p>
          </div>

          {/* MESSAGE */}

          {message.text && (
            <div className="row justify-content-center mb-4">
              <div className="col-lg-10">
                <div
                  className={`alert alert-${message.type} alert-dismissible fade show d-flex justify-content-between align-items-center shadow-sm`}
                  role="alert"
                >
                  <div>
                    {message.type === "success"
                      ? "✅ "
                      : message.type === "danger"
                      ? "❌ "
                      : "ℹ️ "}

                    {message.text}
                  </div>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() =>
                      setMessage({
                        text: "",
                        type: "",
                      })
                    }
                    aria-label="Close"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= SUMMARY ================= */}

          <div className="row g-3 mb-4">

            <div className="col-md-3 col-6">
              <div className="card shadow-sm p-3 border-start border-primary border-4 h-100">
                <h6 className="text-muted mb-1 small text-uppercase">
                  Caretakers
                </h6>

                <h3 className="mb-0 text-primary">
                  {caretakers.length}
                </h3>

                <small className="text-muted">
                  Registered in MongoDB
                </small>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="card shadow-sm p-3 border-start border-info border-4 h-100">
                <h6 className="text-muted mb-1 small text-uppercase">
                  Today&apos;s Doses
                </h6>

                <h3 className="mb-0 text-info">
                  {todayCareItems.length}
                </h3>

                <small className="text-muted">
                  From Schedule & Reminders
                </small>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="card shadow-sm p-3 border-start border-danger border-4 h-100">
                <h6 className="text-muted mb-1 small text-uppercase">
                  Missed Alerts
                </h6>

                <h3 className="mb-0 text-danger">
                  {missedDoseItems.length}
                </h3>

                <small className="text-muted">
                  {missedDoseItems.length > 0
                    ? "Requires attention!"
                    : "All on track"}
                </small>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="card shadow-sm p-3 border-start border-success border-4 h-100">
                <h6 className="text-muted mb-1 small text-uppercase">
                  Emergency Contact
                </h6>

                <h5 className="mb-0 text-truncate text-success">
                  {emergencyCaretaker
                    ? emergencyCaretaker.name
                    : "None set"}
                </h5>

                <small className="text-muted">
                  {emergencyCaretaker
                    ? emergencyCaretaker.phone
                    : "Add contact below"}
                </small>
              </div>
            </div>

          </div>

          {/* ================= MISSED ALERT ================= */}

          {missedDoseItems.length > 0 && (
            <div
              className="alert alert-danger shadow-sm border-start border-danger border-5 mb-4 p-3"
              role="alert"
            >
              <div className="d-flex align-items-start gap-3">

                <span className="fs-2">
                  ⚠️
                </span>

                <div className="flex-grow-1">

                  <h5 className="alert-heading mb-1 text-danger fw-bold">
                    Missed Reminder Alert (
                    {missedDoseItems.length} dose
                    {missedDoseItems.length > 1
                      ? "s"
                      : ""}{" "}
                    overdue)
                  </h5>

                  <p className="mb-2 small">
                    The following scheduled medicines have not been
                    confirmed as taken.
                  </p>

                  <ul className="mb-2 ps-3 small">

                    {missedDoseItems.map((m) => (
                      <li key={m.id}>

                        <strong>
                          {m.medicineName}
                        </strong>{" "}

                        ({m.dosage}) scheduled for{" "}

                        <span className="badge bg-danger">
                          {formatTime(m.time)}
                        </span>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success ms-2 py-0 px-2"
                          onClick={() =>
                            toggleTakenStatus(m.id)
                          }
                        >
                          ✓ Confirm Taken Now
                        </button>

                      </li>
                    ))}

                  </ul>

                </div>
              </div>
            </div>
          )}

          {/* ================= MAIN CONTENT ================= */}

          <div className="row g-4">

            {/* LEFT COLUMN */}

            <div className="col-lg-7">

              {/* TODAY'S CARE */}

              <div className="card shadow-sm mb-4">

                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">

                  <div>
                    <h4 className="mb-0">
                      🩺 Today&apos;s Care & Medicine Monitoring
                    </h4>

                    <small className="text-muted">
                      Monitoring doses from Schedule & AI Reminders
                    </small>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={fetchTodayCare}
                  >
                    🔄 Refresh
                  </button>

                </div>

                <div className="card-body p-0">

                  {loadingCare ? (

                    <div className="p-4 text-center">

                      <div
                        className="spinner-border text-primary spinner-border-sm me-2"
                        role="status"
                      />

                      <span className="text-muted">
                        Synchronizing today&apos;s care monitoring...
                      </span>

                    </div>

                  ) : todayCareItems.length === 0 ? (

                    <div className="p-4 text-center text-muted">

                      <div className="fs-1 mb-2">
                        📋
                      </div>

                      <p className="mb-1">
                        No medicines scheduled for monitoring today.
                      </p>

                      <small>
                        Add medicines in the Schedule or AI Reminder
                        modules to track them here.
                      </small>

                    </div>

                  ) : (

                    <div className="table-responsive">

                      <table className="table table-hover align-middle mb-0">

                        <thead className="table-light">
                          <tr>
                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Time</th>
                            <th>Source</th>
                            <th className="text-center">
                              Status
                            </th>
                            <th className="text-center">
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody>

                          {todayCareItems.map((item) => {

                            const isTaken =
                              !!takenItems[item.id];

                            const isOverdue =
                              !isTaken &&
                              isTimeOverdue(item.time);

                            return (
                              <tr
                                key={item.id}
                                className={
                                  isOverdue
                                    ? "table-danger"
                                    : ""
                                }
                              >

                                <td>
                                  <strong>
                                    💊 {item.medicineName}
                                  </strong>

                                  {item.notes && (
                                    <div className="text-muted small fst-italic">
                                      {item.notes}
                                    </div>
                                  )}
                                </td>

                                <td>
                                  {item.dosage}
                                </td>

                                <td>
                                  <span className="fw-semibold">
                                    {formatTime(item.time)}
                                  </span>
                                </td>

                                <td>
                                  <span
                                    className={`badge ${
                                      item.source === "Schedule"
                                        ? "bg-primary"
                                        : "bg-info text-dark"
                                    }`}
                                  >
                                    {item.source}
                                  </span>
                                </td>

                                <td className="text-center">

                                  {isTaken ? (

                                    <span className="badge bg-success">
                                      ✅ Taken
                                    </span>

                                  ) : isOverdue ? (

                                    <span className="badge bg-danger">
                                      ⚠️ Overdue
                                    </span>

                                  ) : (

                                    <span className="badge bg-warning text-dark">
                                      ⏳ Upcoming
                                    </span>

                                  )}

                                </td>

                                <td className="text-center">

                                  <button
                                    type="button"
                                    className={`btn btn-sm ${
                                      isTaken
                                        ? "btn-outline-secondary"
                                        : "btn-success"
                                    }`}
                                    onClick={() =>
                                      toggleTakenStatus(item.id)
                                    }
                                  >
                                    {isTaken
                                      ? "Undo"
                                      : "Mark Taken"}
                                  </button>

                                </td>

                              </tr>
                            );
                          })}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>
              </div>

              {/* ================= EMERGENCY CONTACT ================= */}

              <div className="card shadow-sm border-start border-danger border-4 mb-4">

                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">

                  <h4 className="mb-0 text-danger">
                    🚨 Emergency Contacts & Quick Dial
                  </h4>

                  <span className="badge bg-danger">
                    24/7 Response
                  </span>

                </div>

                <div className="card-body">

                  {emergencyCaretaker ? (

                    <div className="p-3 bg-light rounded d-flex flex-wrap justify-content-between align-items-center mb-3">

                      <div>

                        <h5 className="mb-1 fw-bold">
                          👤 {emergencyCaretaker.name}

                          <span className="badge bg-info text-dark ms-1">
                            {emergencyCaretaker.relation ||
                              "Family"}
                          </span>
                        </h5>

                        <p className="mb-1 text-muted">
                          <strong>
                            📞 Phone:
                          </strong>{" "}
                          {emergencyCaretaker.phone}
                        </p>

                        {emergencyCaretaker.email && (
                          <p className="mb-0 text-muted small">
                            <strong>
                              ✉️ Email:
                            </strong>{" "}
                            {emergencyCaretaker.email}
                          </p>
                        )}

                      </div>

                      <div className="mt-2 mt-sm-0">

                        <a
                          href={`tel:${emergencyCaretaker.phone}`}
                          className="btn btn-danger btn-lg px-4 shadow-sm"
                        >
                          📞 Call Now
                        </a>

                      </div>

                    </div>

                  ) : (

                    <p className="text-muted mb-3">
                      No designated emergency contact yet.
                      Add one in the form on the right.
                    </p>

                  )}

                  <div className="border-top pt-3">

                    <h6 className="text-muted mb-2 small text-uppercase">
                      National Emergency Helplines
                    </h6>

                    <div className="d-flex flex-wrap gap-2">

                      <a
                        href="tel:102"
                        className="btn btn-outline-danger btn-sm"
                      >
                        🚑 Ambulance: 102
                      </a>

                      <a
                        href="tel:112"
                        className="btn btn-outline-danger btn-sm"
                      >
                        🚨 All Emergency: 112
                      </a>

                      <a
                        href="tel:108"
                        className="btn btn-outline-danger btn-sm"
                      >
                        🏥 Medical: 108
                      </a>

                    </div>

                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}

            <div className="col-lg-5">

              {/* ================= FORM ================= */}

              <div className="card shadow-sm p-4 mb-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h3 className="mb-0">
                    {editingId
                      ? "✏️ Edit Caretaker"
                      : "👤 Add Caretaker"}
                  </h3>

                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={resetForm}
                    >
                      Cancel Edit
                    </button>
                  )}

                </div>

                <form onSubmit={handleSubmit}>

                  {/* NAME */}

                  <div className="mb-3">

                    <label className="form-label">
                      Caretaker Name{" "}
                      <span className="text-danger">
                        *
                      </span>
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

                  {/* PHONE */}

                  <div className="mb-3">

                    <label className="form-label">
                      Phone Number{" "}
                      <span className="text-danger">
                        *
                      </span>
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

                  {/* RELATION */}

                  <div className="mb-3">

                    <label className="form-label">
                      Relationship
                    </label>

                    <select
                      className="form-select"
                      value={relation}
                      onChange={(e) =>
                        setRelation(e.target.value)
                      }
                    >
                      <option value="Family Member">
                        Family Member
                      </option>

                      <option value="Parent">
                        Parent
                      </option>

                      <option value="Spouse">
                        Spouse
                      </option>

                      <option value="Child">
                        Child
                      </option>

                      <option value="Sibling">
                        Sibling
                      </option>

                      <option value="Guardian">
                        Guardian
                      </option>

                      <option value="Doctor / Nurse">
                        Doctor / Nurse
                      </option>

                      <option value="Friend">
                        Friend
                      </option>
                    </select>

                  </div>

                  {/* EMAIL */}

                  <div className="mb-3">

                    <label className="form-label">
                      Email Address (Optional)
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="caretaker@example.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                    />

                  </div>

                  {/* EMERGENCY */}

                  <div className="form-check form-switch mb-3">

                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emergencySwitch"
                      checked={isEmergencyContact}
                      onChange={(e) =>
                        setIsEmergencyContact(
                          e.target.checked
                        )
                      }
                    />

                    <label
                      className="form-check-label fw-semibold"
                      htmlFor="emergencySwitch"
                    >
                      🚨 Primary Emergency Contact
                    </label>

                  </div>

                  {/* PERMISSIONS */}

                  <div className="p-3 bg-light rounded mb-4">

                    <h6 className="fw-bold mb-2">
                      🔒 Caretaker Access & Permissions
                    </h6>

                    <p className="text-muted small mb-2">
                      Configure what this caretaker can view and monitor:
                    </p>

                    {/* SCHEDULE */}

                    <div className="form-check mb-2">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="permSchedule"
                        checked={
                          permissions.viewSchedule
                        }
                        onChange={(e) =>
                          setPermissions((prev) => ({
                            ...prev,
                            viewSchedule:
                              e.target.checked,
                          }))
                        }
                      />

                      <label
                        className="form-check-label small"
                        htmlFor="permSchedule"
                      >
                        📅{" "}
                        <strong>
                          View Schedule
                        </strong>
                        : Inspect daily medicine doses
                      </label>

                    </div>

                    {/* ORDERS */}

                    <div className="form-check mb-2">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="permOrders"
                        checked={
                          permissions.viewOrders
                        }
                        onChange={(e) =>
                          setPermissions((prev) => ({
                            ...prev,
                            viewOrders:
                              e.target.checked,
                          }))
                        }
                      />

                      <label
                        className="form-check-label small"
                        htmlFor="permOrders"
                      >
                        🛒{" "}
                        <strong>
                          View Orders
                        </strong>
                        : Monitor pharmacy medicine orders
                      </label>

                    </div>

                    {/* ALERTS */}

                    <div className="form-check">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="permAlerts"
                        checked={
                          permissions.receiveAlerts
                        }
                        onChange={(e) =>
                          setPermissions((prev) => ({
                            ...prev,
                            receiveAlerts:
                              e.target.checked,
                          }))
                        }
                      />

                      <label
                        className="form-check-label small"
                        htmlFor="permAlerts"
                      >
                        🔔{" "}
                        <strong>
                          Receive Alerts
                        </strong>
                        : Get real-time missed reminder alerts
                      </label>

                    </div>

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fs-5"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Saving..."
                      : editingId
                      ? "💾 Update Caretaker"
                      : "👨‍👩‍👧 Save Caretaker"}
                  </button>

                </form>

              </div>

            </div>
          </div>

          {/* ================= SAVED CARETAKERS ================= */}

          <div className="mt-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h3>
                👥 Saved Caretakers (
                {caretakers.length})
              </h3>

              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={fetchCaretakers}
              >
                🔄 Refresh
              </button>

            </div>

            {loading ? (

              <div className="card shadow-sm p-4 text-center">

                <div
                  className="spinner-border text-primary mx-auto mb-2"
                  role="status"
                />

                <p className="text-muted mb-0">
                  Loading caretakers from database...
                </p>

              </div>

            ) : caretakers.length === 0 ? (

              <div className="card shadow-sm p-5 text-center">

                <div className="display-4 mb-3">
                  👨‍👩‍👧
                </div>

                <h3>
                  No caretakers added yet
                </h3>

                <p className="text-muted">
                  Use the form above to add a trusted family member
                  to monitor your medicine schedule and receive
                  missed reminder alerts.
                </p>

              </div>

            ) : (

              <div className="row g-4">

                {caretakers.map((caretaker) => (

                  <div
                    className="col-md-6 col-lg-4"
                    key={caretaker._id}
                  >

                    <div className="card h-100 shadow-sm border-top border-primary border-3">

                      <div className="card-body d-flex flex-column">

                        <div className="d-flex justify-content-between align-items-start mb-2">

                          <div>

                            <div className="medicine-icon mb-2">
                              👤
                            </div>

                            <h4 className="card-title mb-1">
                              {caretaker.name}
                            </h4>

                          </div>

                          <div className="text-end">

                            <span className="badge bg-info text-dark d-block mb-1">
                              {caretaker.relation ||
                                "Family"}
                            </span>

                            {caretaker.isEmergencyContact && (
                              <span className="badge bg-danger">
                                🚨 Emergency
                              </span>
                            )}

                          </div>

                        </div>

                        <hr className="my-2" />

                        <p className="mb-2 small">

                          <strong>
                            📞 Phone:
                          </strong>{" "}

                          <a
                            href={`tel:${caretaker.phone}`}
                            className="text-decoration-none"
                          >
                            {caretaker.phone}
                          </a>

                        </p>

                        {caretaker.email && (
                          <p className="mb-2 small">

                            <strong>
                              ✉️ Email:
                            </strong>{" "}

                            <a
                              href={`mailto:${caretaker.email}`}
                              className="text-decoration-none"
                            >
                              {caretaker.email}
                            </a>

                          </p>
                        )}

                        {/* PERMISSIONS */}

                        <div className="mb-3 pt-1">

                          <strong className="small text-muted d-block mb-1">
                            Granted Permissions:
                          </strong>

                          <div className="d-flex flex-wrap gap-1">

                            {caretaker.permissions
                              ?.viewSchedule !== false && (
                              <span className="badge bg-light text-dark border">
                                👁️ Schedule
                              </span>
                            )}

                            {caretaker.permissions
                              ?.viewOrders !== false && (
                              <span className="badge bg-light text-dark border">
                                🛒 Orders
                              </span>
                            )}

                            {caretaker.permissions
                              ?.receiveAlerts !== false && (
                              <span className="badge bg-light text-danger border border-danger">
                                🔔 Alerts
                              </span>
                            )}

                          </div>

                        </div>

                        {/* BUTTONS */}

                        <div className="mt-auto d-flex gap-2 pt-2 border-top">

                          <a
                            href={`tel:${caretaker.phone}`}
                            className="btn btn-outline-success btn-sm"
                          >
                            📞 Call
                          </a>

                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm flex-fill"
                            onClick={() =>
                              handleStartEdit(caretaker)
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm flex-fill"
                            onClick={() =>
                              handleDelete(caretaker._id)
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* BACK BUTTON */}

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

      {/* FOOTER */}

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

export default Caretaker;