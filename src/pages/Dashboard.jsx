import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

function Dashboard() {
  const navigate = useNavigate();

  // Search input state
  const [searchTerm, setSearchTerm] = useState("");

  // Logged-in user information
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState(null);

  // Live MongoDB states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [caretakers, setCaretakers] = useState([]);


  // ================= USER INFORMATION =================

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (savedUser?.fullName) {
        setUserName(savedUser.fullName);
      }
      if (savedUser?.id || savedUser?._id) {
        setUserId(savedUser.id || savedUser._id);
      }
    } catch (error) {
      console.error("Error reading user information:", error);
    }
  }, []);


  // ================= FETCH DASHBOARD DATA =================

  const fetchDashboardData = useCallback(async () => {
    try {

      setRefreshing(true);

      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      const currentUserId = savedUser?.id || savedUser?._id || userId;

      const userParam = currentUserId ? `?userId=${currentUserId}` : "";

      const [
        medsRes,
        ordersRes,
        schedRes,
        remRes,
        careRes
      ] = await Promise.all([
        fetch(`${API_URL}/api/medicines`),
        fetch(`${API_URL}/api/orders${userParam}`),
        fetch(`${API_URL}/api/schedules${userParam}`),
        fetch(`${API_URL}/api/reminders${userParam}`),
        fetch(`${API_URL}/api/caretakers${userParam}`)
      ]);


      if (medsRes.ok) {
        const data = await medsRes.json();
        setMedicines(Array.isArray(data) ? data : []);
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(Array.isArray(data) ? data : []);
      }

      if (schedRes.ok) {
        const data = await schedRes.json();
        setSchedules(Array.isArray(data) ? data : []);
      }

      if (remRes.ok) {
        const data = await remRes.json();
        setReminders(Array.isArray(data) ? data : []);
      }

      if (careRes.ok) {
        const data = await careRes.json();
        setCaretakers(Array.isArray(data) ? data : []);
      }


      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );

    } catch (err) {

      console.error(
        "Error fetching dashboard data:",
        err
      );

    } finally {

      setRefreshing(false);

    }

  }, [userId]);


  // ================= INITIAL LOAD =================

  useEffect(() => {

    let isMounted = true;
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    const currentUserId = savedUser?.id || savedUser?._id || userId;
    const userParam = currentUserId ? `?userId=${currentUserId}` : "";

    Promise.all([
      fetch(`${API_URL}/api/medicines`)
        .then((r) => (r.ok ? r.json() : [])),

      fetch(`${API_URL}/api/orders${userParam}`)
        .then((r) => (r.ok ? r.json() : [])),

      fetch(`${API_URL}/api/schedules${userParam}`)
        .then((r) => (r.ok ? r.json() : [])),

      fetch(`${API_URL}/api/reminders${userParam}`)
        .then((r) => (r.ok ? r.json() : [])),

      fetch(`${API_URL}/api/caretakers${userParam}`)
        .then((r) => (r.ok ? r.json() : []))
    ])

      .then(
        ([
          medsData,
          ordersData,
          schedsData,
          remsData,
          careData
        ]) => {

          if (!isMounted) return;

          setMedicines(medsData);
          setOrders(ordersData);
          setSchedules(schedsData);
          setReminders(remsData);
          setCaretakers(careData);

          setLoading(false);

          setLastUpdated(
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })
          );

        }
      )

      .catch((err) => {

        console.error(
          "Error loading initial dashboard data:",
          err
        );

        if (isMounted) {
          setLoading(false);
        }

      });


    // Update when user returns to tab
    const handleFocus = () => {
      fetchDashboardData();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );


    // Auto refresh every 30 seconds
    const interval = setInterval(() => {

      fetchDashboardData();

    }, 30000);


    return () => {

      isMounted = false;

      window.removeEventListener(
        "focus",
        handleFocus
      );

      clearInterval(interval);

    };

  }, [fetchDashboardData]);


  // ================= FORMAT TIME =================

  const formatTime = (timeStr) => {

    if (!timeStr) return "N/A";

    const [hours, minutes] =
      timeStr.split(":");

    let hour = parseInt(hours);

    const ampm =
      hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${String(hour).padStart(
      2,
      "0"
    )}:${minutes} ${ampm}`;

  };


  // ================= FORMAT DATE =================

  const formatDate = (dateStr) => {

    if (!dateStr) return "N/A";

    const d = new Date(dateStr);

    return d.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric"
      }
    );

  };


  // ================= SEARCH =================

  const handleSearch = (e) => {

    e.preventDefault();

    if (searchTerm.trim()) {

      navigate(
        `/medicines?search=${encodeURIComponent(
          searchTerm.trim()
        )}`
      );

    } else {

      navigate("/medicines");

    }

  };


  // ================= METRICS =================

  const totalMedicines =
    medicines.length;

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (o) =>
        o.status === "Pending" ||
        !o.status
    ).length;

  const completedOrders =
    orders.filter(
      (o) =>
        o.status === "Completed"
    ).length;

  const cancelledOrders =
    orders.filter(
      (o) =>
        o.status === "Cancelled"
    ).length;

  const totalSchedules =
    schedules.length;

  const totalReminders =
    reminders.length;

  const totalCaretakers =
    caretakers.length;


  const primaryCaretaker =
    caretakers.find(
      (c) => c.isEmergencyContact
    ) ||
    caretakers[0] ||
    null;


  // ================= TIMELINE =================

  const combinedTimeline = [

    ...schedules.map((s) => ({
      id: `sched-${s._id}`,
      name: s.medicineName,
      dosage: s.dosage,
      time: s.time,
      type: "Schedule",
      badgeClass: "bg-primary"
    })),

    ...reminders.map((r) => ({
      id: `rem-${r._id}`,
      name: r.medicineName,
      dosage: r.dosage,
      time: r.time,
      type: "AI Reminder",
      badgeClass:
        "bg-info text-dark"
    }))

  ].sort(
    (a, b) =>
      (a.time || "").localeCompare(
        b.time || ""
      )
  );


  // ================= RECENT ORDERS =================

  const recentOrders =
    orders.slice(0, 5);


  return (
    <>

      {/* ================= NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg">

        <div className="container">

          {/* Logo */}

          <Link
            className="navbar-brand"
            to="/dashboard"
          >
            💊 Online Pharmacy
          </Link>


          {/* Search */}

          <div className="dashboard-search d-none d-md-block">

            <form onSubmit={handleSearch}>

              <input
                type="text"
                placeholder="🔍 Search medicines..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </form>

          </div>


          {/* ================= MY PROFILE ================= */}

          <Link
            to="/profile"
            className="btn profile-btn ms-3"
          >
            👤 My Profile
          </Link>

        </div>

      </nav>


      {/* ================= DASHBOARD ================= */}

      <section className="dashboard-section">

        <div className="container">


          {/* ================= WELCOME ================= */}

          <div className="dashboard-welcome d-flex flex-wrap justify-content-between align-items-center mb-4">

            <div>

              <h1>
                Hello,{" "}
                <span id="userName">
                  {userName}
                </span>{" "}
                👋
              </h1>

              <p className="mb-0 text-muted">
                Welcome to your personal healthcare dashboard.
                Live synchronized with MongoDB.
              </p>

            </div>


            {/* Refresh */}

            <div className="mt-2 mt-sm-0 text-end">

              <button
                className="btn btn-sm btn-outline-secondary shadow-sm"
                onClick={() =>
                  fetchDashboardData()
                }
                disabled={refreshing}
                title="Refresh dashboard data from database"
              >
                {refreshing
                  ? "Refreshing..."
                  : "🔄 Refresh"}
              </button>


              {lastUpdated && (

                <div className="text-muted small mt-1">

                  Updated:{" "}
                  {lastUpdated}

                </div>

              )}

            </div>

          </div>


          {/* ================= LIVE METRICS ================= */}

          <div className="row g-3 mb-4">


            {/* Medicines */}

            <div className="col-md-3 col-6">

              <Link
                to="/medicines"
                className="text-decoration-none"
              >

                <div className="card shadow-sm p-3 border-start border-primary border-4 h-100 hover-card">

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <h6 className="text-muted mb-1 small text-uppercase">
                        Medicines
                      </h6>

                      <h3 className="mb-0 text-primary">

                        {loading
                          ? "..."
                          : totalMedicines}

                      </h3>

                      <small className="text-muted">
                        In Catalog
                      </small>

                    </div>

                    <span className="fs-1">
                      💊
                    </span>

                  </div>

                </div>

              </Link>

            </div>


            {/* Orders */}

            <div className="col-md-3 col-6">

              <Link
                to="/orders"
                className="text-decoration-none"
              >

                <div className="card shadow-sm p-3 border-start border-warning border-4 h-100 hover-card">

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <h6 className="text-muted mb-1 small text-uppercase">
                        Total Orders
                      </h6>

                      <h3 className="mb-0 text-dark">

                        {loading
                          ? "..."
                          : totalOrders}

                      </h3>

                      <small className="text-muted">

                        <span className="text-warning fw-semibold">
                          {pendingOrders} Pending
                        </span>

                        {" • "}

                        <span className="text-success">
                          {completedOrders} Done
                        </span>

                        {cancelledOrders > 0 && (

                          <span className="text-danger ms-1">
                            ({cancelledOrders} Cancelled)
                          </span>

                        )}

                      </small>

                    </div>

                    <span className="fs-1">
                      🛒
                    </span>

                  </div>

                </div>

              </Link>

            </div>


            {/* Schedule */}

            <div className="col-md-3 col-6">

              <Link
                to="/schedule"
                className="text-decoration-none"
              >

                <div className="card shadow-sm p-3 border-start border-info border-4 h-100 hover-card">

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <h6 className="text-muted mb-1 small text-uppercase">
                        Schedule &amp; Alarms
                      </h6>

                      <h3 className="mb-0 text-info">

                        {loading
                          ? "..."
                          : totalSchedules +
                            totalReminders}

                      </h3>

                      <small className="text-muted">

                        {totalSchedules} Timings
                        {" • "}
                        {totalReminders} AI Voice

                      </small>

                    </div>

                    <span className="fs-1">
                      ⏰
                    </span>

                  </div>

                </div>

              </Link>

            </div>


            {/* Caretaker */}

            <div className="col-md-3 col-6">

              <Link
                to="/caretaker"
                className="text-decoration-none"
              >

                <div className="card shadow-sm p-3 border-start border-success border-4 h-100 hover-card">

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <h6 className="text-muted mb-1 small text-uppercase">
                        Caretaker Status
                      </h6>

                      <h5 className="mb-0 text-success text-truncate">

                        {loading
                          ? "..."
                          : totalCaretakers > 0
                          ? "✅ Active"
                          : "⚠️ Not Set"}

                      </h5>

                      <small className="text-muted text-truncate d-block">

                        {primaryCaretaker
                          ? `${primaryCaretaker.name} (${primaryCaretaker.relation})`
                          : "Configure in Caretaker"}

                      </small>

                    </div>

                    <span className="fs-1">
                      👨‍👩‍👧
                    </span>

                  </div>

                </div>

              </Link>

            </div>

          </div>


          {/* ================= MOBILE SEARCH ================= */}

          <div className="dashboard-mobile-search d-md-none mb-4">

            <form onSubmit={handleSearch}>

              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search medicines..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </form>

          </div>


          {/* ================= QUICK SEARCH ================= */}

          <div className="dashboard-search-box mb-5">

            <h4>
              🔍 What are you looking for?
            </h4>

            <form onSubmit={handleSearch}>

              <div className="input-group">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search medicines, vitamins, healthcare products..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Search
                </button>

              </div>

            </form>

          </div>


          {/* ================= ACTIVITY ROW ================= */}

          <div className="row g-4 mb-5">


            {/* Schedule & Reminders */}

            <div className="col-lg-6">

              <div className="card shadow-sm h-100">

                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">

                  <h5 className="mb-0">
                    ⏰ Today's Medicine Schedule &amp; Reminders
                  </h5>

                  <div className="d-flex gap-2">

                    <Link
                      to="/schedule"
                      className="btn btn-outline-primary btn-sm"
                    >
                      📅 Schedule
                    </Link>

                    <Link
                      to="/reminder"
                      className="btn btn-outline-info btn-sm"
                    >
                      🎤 Reminders
                    </Link>

                  </div>

                </div>


                <div className="card-body p-0">

                  {loading ? (

                    <div className="p-4 text-center">

                      <div
                        className="spinner-border spinner-border-sm text-primary me-2"
                        role="status"
                      ></div>

                      <span className="text-muted">
                        Loading schedules from database...
                      </span>

                    </div>

                  ) : combinedTimeline.length === 0 ? (

                    <div className="p-4 text-center text-muted">

                      <div className="fs-1 mb-2">
                        📋
                      </div>

                      <p className="mb-2">
                        No medicines scheduled for today.
                      </p>

                      <Link
                        to="/schedule"
                        className="btn btn-sm btn-primary"
                      >
                        ➕ Add Medicine Schedule
                      </Link>

                    </div>

                  ) : (

                    <div className="table-responsive">

                      <table className="table table-hover align-middle mb-0">

                        <thead className="table-light">

                          <tr>

                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Time</th>
                            <th className="text-center">
                              Type
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {combinedTimeline.map(
                            (item) => (

                              <tr key={item.id}>

                                <td>
                                  <strong>
                                    💊 {item.name}
                                  </strong>
                                </td>

                                <td>
                                  {item.dosage}
                                </td>

                                <td>

                                  <span className="fw-semibold text-primary">
                                    {formatTime(
                                      item.time
                                    )}
                                  </span>

                                </td>

                                <td className="text-center">

                                  <span
                                    className={`badge ${item.badgeClass}`}
                                  >
                                    {item.type}
                                  </span>

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>

              </div>

            </div>


            {/* Recent Orders */}

            <div className="col-lg-6">

              <div className="card shadow-sm h-100">

                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">

                  <h5 className="mb-0">
                    🛒 Recent Orders &amp; Activity
                  </h5>

                  <div className="d-flex gap-2">

                    <Link
                      to="/orders"
                      className="btn btn-outline-primary btn-sm"
                    >
                      Cart &amp; Orders
                    </Link>

                    <Link
                      to="/history"
                      className="btn btn-outline-secondary btn-sm"
                    >
                      History
                    </Link>

                  </div>

                </div>


                <div className="card-body p-0">

                  {loading ? (

                    <div className="p-4 text-center">

                      <div
                        className="spinner-border spinner-border-sm text-primary me-2"
                        role="status"
                      ></div>

                      <span className="text-muted">
                        Loading orders from database...
                      </span>

                    </div>

                  ) : recentOrders.length === 0 ? (

                    <div className="p-4 text-center text-muted">

                      <div className="fs-1 mb-2">
                        🛍️
                      </div>

                      <p className="mb-2">
                        No orders placed yet.
                      </p>

                      <Link
                        to="/medicines"
                        className="btn btn-sm btn-primary"
                      >
                        💊 Browse Medicines
                      </Link>

                    </div>

                  ) : (

                    <div className="table-responsive">

                      <table className="table table-hover align-middle mb-0">

                        <thead className="table-light">

                          <tr>

                            <th>Medicine</th>

                            <th className="text-center">
                              Qty
                            </th>

                            <th className="text-end">
                              Total
                            </th>

                            <th>Date</th>

                            <th className="text-center">
                              Status
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {recentOrders.map(
                            (order) => (

                              <tr key={order._id}>

                                <td>
                                  <strong>
                                    {order.medicineName}
                                  </strong>
                                </td>

                                <td className="text-center">

                                  <span className="badge bg-light text-dark border">
                                    x
                                    {order.quantity || 1}
                                  </span>

                                </td>

                                <td className="text-end font-monospace">

                                  ₹
                                  {order.totalPrice ||
                                    order.price *
                                      (order.quantity ||
                                        1)}

                                </td>

                                <td className="small text-muted">

                                  {formatDate(
                                    order.orderDate
                                  )}

                                </td>

                                <td className="text-center">

                                  {order.status ===
                                  "Completed" ? (

                                    <span className="badge bg-success">
                                      ✅ Done
                                    </span>

                                  ) : order.status ===
                                    "Cancelled" ? (

                                    <span className="badge bg-danger">
                                      ❌ Cancelled
                                    </span>

                                  ) : (

                                    <span className="badge bg-warning text-dark">
                                      ⏳ Pending
                                    </span>

                                  )}

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>


          {/* ================= HEALTHCARE MODULES ================= */}

          <h3 className="dashboard-title">
            My Healthcare Modules
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
                    Explore{" "}
                    {totalMedicines > 0
                      ? `(${totalMedicines})`
                      : ""}{" "}
                    →
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
                    Manage{" "}
                    {totalReminders > 0
                      ? `(${totalReminders})`
                      : ""}{" "}
                    →
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
                    Manage{" "}
                    {totalCaretakers > 0
                      ? `(${totalCaretakers})`
                      : ""}{" "}
                    →
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
                    View Schedule{" "}
                    {totalSchedules > 0
                      ? `(${totalSchedules})`
                      : ""}{" "}
                    →
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
                    View History{" "}
                    {completedOrders +
                      cancelledOrders >
                    0
                      ? `(${
                          completedOrders +
                          cancelledOrders
                        })`
                      : ""}{" "}
                    →
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
                    View Orders{" "}
                    {pendingOrders > 0
                      ? `(${pendingOrders} pending)`
                      : ""}{" "}
                    →
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
                Keep your personal information updated
                for a better healthcare experience.
              </p>

            </div>


            <Link
              to="/profile"
              className="btn btn-primary"
            >
              👤 View Profile
            </Link>

          </div>


        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="text-center">

        <p>
          💊 Online Pharmacy &amp; AI Medicine Reminder
        </p>

        <p>
          © 2026 All Rights Reserved
        </p>

      </footer>

    </>
  );
}

export default Dashboard;