import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("history");
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });
  const [processingId, setProcessingId] = useState(null);

  // =====================================================
  // LOGGED-IN USER
  // =====================================================

  const savedUser = JSON.parse(
    localStorage.getItem("user")
  );

  const userId = savedUser?.id;

  // =====================================================
  // FETCH HISTORY
  // =====================================================

  const fetchHistory = async (
    filterMode = activeFilter
  ) => {
    try {
      setLoading(true);

      if (!userId) {
        setMessage({
          text: "Please login first.",
          type: "danger",
        });
        setLoading(false);
        return;
      }

      let url =
        `http://localhost:5000/api/history?userId=${userId}`;

      if (
        filterMode === "Completed" ||
        filterMode === "Cancelled" ||
        filterMode === "all"
      ) {
        url += `&status=${filterMode}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        const data = await res.json();

        throw new Error(
          data.message ||
            "Failed to load order history."
        );
      }

      const data = await res.json();

      setHistory(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "Error fetching order history:",
        err
      );

      setMessage({
        text:
          err.message ||
          "Unable to connect to order history service.",
        type: "danger",
      });

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD HISTORY WHEN FILTER CHANGES
  // =====================================================

  useEffect(() => {
    fetchHistory(activeFilter);
  }, [activeFilter]);

  // =====================================================
  // FORMAT DATE AND TIME
  // =====================================================

  const formatDateTime = (dateStr) => {
    if (!dateStr) {
      return "N/A";
    }

    const d = new Date(dateStr);

    if (Number.isNaN(d.getTime())) {
      return "N/A";
    }

    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const handleUpdateStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      setProcessingId(orderId);

      if (!userId) {
        setMessage({
          text: "Please login first.",
          type: "danger",
        });
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/history/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId,
            status: newStatus,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status."
        );
      }

      setMessage({
        text:
          `Order status updated to "${newStatus}"`,
        type: "success",
      });

      await fetchHistory(activeFilter);

    } catch (err) {
      console.error(
        "Error updating order status:",
        err
      );

      setMessage({
        text:
          err.message ||
          "Unable to connect to server.",
        type: "danger",
      });

    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // DELETE SINGLE HISTORY ENTRY
  // =====================================================

  const handleDeleteEntry = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this record from history?"
      )
    ) {
      return;
    }

    try {
      setProcessingId(orderId);

      if (!userId) {
        setMessage({
          text: "Please login first.",
          type: "danger",
        });
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/history/${orderId}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to delete record."
        );
      }

      setMessage({
        text:
          "History record deleted successfully.",
        type: "success",
      });

      setHistory((prev) =>
        prev.filter(
          (item) => item._id !== orderId
        )
      );

    } catch (err) {
      console.error(
        "Error deleting history record:",
        err
      );

      setMessage({
        text:
          err.message ||
          "Unable to connect to server.",
        type: "danger",
      });

    } finally {
      setProcessingId(null);
    }
  };

  // =====================================================
  // CLEAR HISTORY
  // =====================================================

  const handleClearHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all completed and cancelled order history?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      if (!userId) {
        setMessage({
          text: "Please login first.",
          type: "danger",
        });
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/history?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to clear history."
        );
      }

      setMessage({
        text:
          `History cleared (${data.deletedCount || 0} records removed)`,
        type: "success",
      });

      await fetchHistory(activeFilter);

    } catch (err) {
      console.error(
        "Error clearing history:",
        err
      );

      setMessage({
        text:
          err.message ||
          "Unable to connect to server.",
        type: "danger",
      });

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // METRICS
  // =====================================================

  const completedCount =
    history.filter(
      (h) => h.status === "Completed"
    ).length;

  const cancelledCount =
    history.filter(
      (h) => h.status === "Cancelled"
    ).length;

  const totalCompletedSpent =
    history
      .filter(
        (h) => h.status === "Completed"
      )
      .reduce(
        (sum, h) =>
          sum + (Number(h.totalPrice) || 0),
        0
      );

  // =====================================================
  // UI
  // =====================================================

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
              to="/orders"
              className="nav-link me-3"
            >
              🛒 Orders
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

          {/* HEADING */}

          <div className="text-center mb-4">

            <div className="register-icon">
              📊
            </div>

            <h1>
              Order & Medicine History
            </h1>

            <p className="text-muted">
              Track and review your previous
              completed and cancelled medicine
              orders.
            </p>

          </div>

          {/* ================= MESSAGE ================= */}

          {message.text && (
            <div className="row justify-content-center mb-4">

              <div className="col-lg-8">

                <div
                  className={`alert alert-${message.type} alert-dismissible fade show d-flex justify-content-between align-items-center`}
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

          {/* ================= METRICS ================= */}

          <div className="row g-3 mb-4">

            {/* COMPLETED */}

            <div className="col-md-4">

              <div className="card shadow-sm p-3 border-start border-success border-4 h-100">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6 className="text-muted mb-1">
                      Completed Orders
                    </h6>

                    <h3 className="mb-0 text-success">
                      {completedCount}
                    </h3>

                    <small className="text-muted">
                      Spent: ₹
                      {totalCompletedSpent}
                    </small>

                  </div>

                  <span className="fs-1">
                    ✅
                  </span>

                </div>

              </div>

            </div>

            {/* CANCELLED */}

            <div className="col-md-4">

              <div className="card shadow-sm p-3 border-start border-danger border-4 h-100">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6 className="text-muted mb-1">
                      Cancelled Orders
                    </h6>

                    <h3 className="mb-0 text-danger">
                      {cancelledCount}
                    </h3>

                    <small className="text-muted">
                      Orders Cancelled
                    </small>

                  </div>

                  <span className="fs-1">
                    ❌
                  </span>

                </div>

              </div>

            </div>

            {/* TOTAL */}

            <div className="col-md-4">

              <div className="card shadow-sm p-3 border-start border-primary border-4 h-100">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6 className="text-muted mb-1">
                      Total in View
                    </h6>

                    <h3 className="mb-0 text-primary">
                      {history.length}
                    </h3>

                    <small className="text-muted">
                      Filtered Records
                    </small>

                  </div>

                  <span className="fs-1">
                    📋
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* ================= FILTERS ================= */}

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">

            <div
              className="btn-group"
              role="group"
            >

              <button
                type="button"
                className={`btn btn-sm ${
                  activeFilter === "history"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() =>
                  setActiveFilter("history")
                }
              >
                All History
                <br />
                <small>
                  Completed & Cancelled
                </small>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${
                  activeFilter === "Completed"
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                onClick={() =>
                  setActiveFilter("Completed")
                }
              >
                ✅ Completed
                <br />
                <small>
                  ({completedCount})
                </small>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${
                  activeFilter === "Cancelled"
                    ? "btn-danger"
                    : "btn-outline-danger"
                }`}
                onClick={() =>
                  setActiveFilter("Cancelled")
                }
              >
                ❌ Cancelled
                <br />
                <small>
                  ({cancelledCount})
                </small>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${
                  activeFilter === "all"
                    ? "btn-secondary"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  setActiveFilter("all")
                }
              >
                📋 All Orders
              </button>

            </div>

            {/* ACTIONS */}

            <div className="d-flex gap-2">

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() =>
                  fetchHistory(activeFilter)
                }
                title="Refresh history from database"
              >
                🔄 Refresh
              </button>

              {history.length > 0 && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleClearHistory}
                >
                  🗑️ Clear History
                </button>
              )}

            </div>

          </div>

          {/* ================= LOADING ================= */}

          {loading ? (

            <div className="card shadow-sm p-5 text-center">

              <div
                className="spinner-border text-primary mx-auto mb-3"
                role="status"
              />

              <p className="text-muted mb-0">
                Loading order history from
                MongoDB...
              </p>

            </div>

          ) : history.length === 0 ? (

            /* ================= EMPTY ================= */

            <div className="card shadow-sm p-5 text-center">

              <div className="display-4 mb-3">
                📋
              </div>

              <h3>
                No order history found
              </h3>

              <p className="text-muted">

                {activeFilter === "Completed"
                  ? "You have no completed orders yet."
                  : activeFilter === "Cancelled"
                  ? "You have no cancelled orders."
                  : activeFilter === "all"
                  ? "You have no orders yet."
                  : "Your completed and cancelled medicine orders will appear here."}

              </p>

              <div className="mt-3 d-flex justify-content-center gap-2">

                <Link
                  to="/orders"
                  className="btn btn-primary"
                >
                  🛒 View Current Orders
                </Link>

                <Link
                  to="/medicines"
                  className="btn btn-outline-primary"
                >
                  💊 Browse Medicines
                </Link>

              </div>

            </div>

          ) : (

            /* ================= HISTORY TABLE ================= */

            <div className="card shadow-sm">

              <div className="table-responsive">

                <table className="table table-hover align-middle mb-0">

                  <thead className="table-light">

                    <tr>

                      <th>
                        Medicine Name
                      </th>

                      <th className="text-center">
                        Quantity
                      </th>

                      <th className="text-end">
                        Price
                      </th>

                      <th className="text-end">
                        Total Price
                      </th>

                      <th>
                        Order Date
                      </th>

                      <th className="text-center">
                        Status
                      </th>

                      <th className="text-center">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {history.map((record) => (

                      <tr key={record._id}>

                        {/* MEDICINE */}

                        <td>

                          <div className="d-flex align-items-center">

                            <span className="me-2 fs-5">
                              {record.medicineId?.icon ||
                                "💊"}
                            </span>

                            <div>

                              <strong>
                                {record.medicineName}
                              </strong>

                              {record.medicineId
                                ?.category && (
                                <div className="text-muted small">
                                  {
                                    record
                                      .medicineId
                                      .category
                                  }
                                </div>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* QUANTITY */}

                        <td className="text-center">

                          <span className="badge bg-light text-dark border px-2 py-1">
                            x
                            {record.quantity || 1}
                          </span>

                        </td>

                        {/* PRICE */}

                        <td className="text-end">
                          ₹{record.price}
                        </td>

                        {/* TOTAL */}

                        <td className="text-end font-monospace">

                          <strong>
                            ₹
                            {record.totalPrice ||
                              record.price *
                                (record.quantity ||
                                  1)}
                          </strong>

                        </td>

                        {/* DATE */}

                        <td className="small">
                          {formatDateTime(
                            record.orderDate
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="text-center">

                          {record.status ===
                          "Completed" ? (

                            <span className="badge bg-success">
                              ✅ Completed
                            </span>

                          ) : record.status ===
                            "Cancelled" ? (

                            <span className="badge bg-danger">
                              ❌ Cancelled
                            </span>

                          ) : (

                            <span className="badge bg-warning text-dark">
                              ⏳{" "}
                              {record.status ||
                                "Pending"}
                            </span>

                          )}

                        </td>

                        {/* ACTIONS */}

                        <td className="text-center">

                          <div
                            className="btn-group btn-group-sm"
                            role="group"
                          >

                            {/* PENDING */}

                            {record.status ===
                              "Pending" && (
                              <>
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      record._id,
                                      "Completed"
                                    )
                                  }
                                  disabled={
                                    processingId ===
                                    record._id
                                  }
                                  title="Mark order as completed"
                                >
                                  ✓ Complete
                                </button>

                                <button
                                  className="btn btn-outline-warning btn-sm"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      record._id,
                                      "Cancelled"
                                    )
                                  }
                                  disabled={
                                    processingId ===
                                    record._id
                                  }
                                  title="Cancel order"
                                >
                                  ✕ Cancel
                                </button>
                              </>
                            )}

                            {/* COMPLETED */}

                            {record.status ===
                              "Completed" && (
                              <button
                                className="btn btn-outline-warning btn-sm"
                                onClick={() =>
                                  handleUpdateStatus(
                                    record._id,
                                    "Cancelled"
                                  )
                                }
                                disabled={
                                  processingId ===
                                  record._id
                                }
                                title="Change to Cancelled"
                              >
                                Cancel
                              </button>
                            )}

                            {/* CANCELLED */}

                            {record.status ===
                              "Cancelled" && (
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() =>
                                  handleUpdateStatus(
                                    record._id,
                                    "Completed"
                                  )
                                }
                                disabled={
                                  processingId ===
                                  record._id
                                }
                                title="Restore to Completed"
                              >
                                Complete
                              </button>
                            )}

                            {/* DELETE */}

                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                handleDeleteEntry(
                                  record._id
                                )
                              }
                              disabled={
                                processingId ===
                                record._id
                              }
                              title="Delete from history"
                            >
                              🗑️
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

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
          💊 Online Pharmacy & Medicine
          History System
        </p>

        <p>
          © 2026 All Rights Reserved
        </p>

      </footer>
    </>
  );
}

export default History;