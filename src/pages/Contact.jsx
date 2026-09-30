import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessageText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  // Submitted messages from MongoDB
  const [submittedMessages, setSubmittedMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Email format validation helper
  const isValidEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr.trim());
  };

  // Fetch submitted messages from MongoDB
  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`${API_URL}/api/contact`);
      if (res.ok) {
        const data = await res.json();
        setSubmittedMessages(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error loading contact messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_URL}/api/contact`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (isMounted) {
          setSubmittedMessages(Array.isArray(data) ? data : []);
          setLoadingMessages(false);
        }
      })
      .catch((err) => {
        console.error("Error loading contact messages:", err);
        if (isMounted) setLoadingMessages(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Format date and time
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!name.trim()) {
      setFeedback({ text: "Please enter your name.", type: "danger" });
      return;
    }

    if (!email.trim()) {
      setFeedback({ text: "Please enter your email address.", type: "danger" });
      return;
    }

    if (!isValidEmail(email)) {
      setFeedback({ text: "Please enter a valid email address (e.g. name@example.com).", type: "danger" });
      return;
    }

    if (!subject.trim()) {
      setFeedback({ text: "Please enter a subject for your message.", type: "danger" });
      return;
    }

    if (!message.trim()) {
      setFeedback({ text: "Please enter your message.", type: "danger" });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback({ text: "", type: "" });

      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim()
        })
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback({
          text: data.message || "Your message has been submitted successfully!",
          type: "success"
        });
        // Clear form
        setName("");
        setEmail("");
        setSubject("");
        setMessageText("");
        // Reload messages from MongoDB
        fetchMessages();
      } else {
        setFeedback({
          text: data.message || "Failed to submit message. Please try again.",
          type: "danger"
        });
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setFeedback({
        text: "Unable to connect to the server. Please check your network and try again.",
        type: "danger"
      });
    } finally {
      setSubmitting(false);
    }
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

      {/* ================= CONTACT SECTION ================= */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <div className="register-icon">
              📞
            </div>

            <h1>Contact Us</h1>

            <p className="text-muted">
              We&apos;re here to help with your healthcare needs.
            </p>
          </div>

          {/* Feedback Message Alert */}
          {feedback.text && (
            <div className="row justify-content-center mb-4">
              <div className="col-lg-11">
                <div
                  className={`alert alert-${feedback.type} alert-dismissible fade show d-flex justify-content-between align-items-center shadow-sm`}
                  role="alert"
                >
                  <div>
                    {feedback.type === "success" ? "✅ " : "❌ "}
                    {feedback.text}
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setFeedback({ text: "", type: "" })}
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            </div>
          )}

          <div className="row justify-content-center g-4">
            {/* Contact Information */}
            <div className="col-md-5">
              <div className="card shadow-sm h-100 p-4">
                <h3 className="mb-4">
                  📋 Get in Touch
                </h3>

                <p>
                  <strong>📧 Email</strong>
                  <br />
                  <a href="mailto:support@onlinepharmacy.com" className="text-decoration-none">
                    support@onlinepharmacy.com
                  </a>
                </p>

                <p>
                  <strong>📞 Phone</strong>
                  <br />
                  <a href="tel:+919876543210" className="text-decoration-none">
                    +91 98765 43210
                  </a>
                </p>

                <p>
                  <strong>📍 Address</strong>
                  <br />
                  Hyderabad, India
                </p>

                <p>
                  <strong>🕐 Support Hours</strong>
                  <br />
                  Monday – Saturday
                  <br />
                  9:00 AM – 6:00 PM
                </p>

                <div className="mt-auto p-3 bg-light rounded border">
                  <small className="text-muted">
                    ⚡ <strong>Quick Response Commitment:</strong> We typically respond to customer inquiries within 24 business hours.
                  </small>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-md-6">
              <div className="card shadow-sm p-4">
                <h3 className="mb-4">
                  💬 Send us a Message
                </h3>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email (e.g. name@example.com)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div className="mb-3">
                    <label className="form-label">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Order Delivery, Medicine Inquiry, Caretaker Support"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="mb-3">
                    <label className="form-label">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Describe your inquiry or question..."
                      value={message}
                      onChange={(e) => setMessageText(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fs-5"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "💬 Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ================= SUBMITTED MESSAGES SECTION ================= */}
          <div className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>
                📋 Your Submitted Messages ({submittedMessages.length})
              </h3>

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={fetchMessages}
                title="Refresh messages from database"
              >
                🔄 Refresh
              </button>
            </div>

            {loadingMessages ? (
              <div className="card shadow-sm p-4 text-center">
                <div className="spinner-border text-primary mx-auto mb-2" role="status"></div>
                <p className="text-muted mb-0">Loading messages from MongoDB...</p>
              </div>
            ) : submittedMessages.length === 0 ? (
              <div className="card shadow-sm p-4 text-center text-muted">
                <div className="fs-2 mb-2">✉️</div>
                <p className="mb-0">No contact messages submitted yet. Use the form above to reach out to us.</p>
              </div>
            ) : (
              <div className="row g-3">
                {submittedMessages.map((msg) => (
                  <div className="col-md-6" key={msg._id}>
                    <div className="card shadow-sm h-100 border-start border-primary border-4 p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="mb-0 text-primary">
                          {msg.subject}
                        </h5>
                        <span className="badge bg-success">
                          {msg.status || "New"}
                        </span>
                      </div>

                      <p className="mb-2 small text-muted">
                        <strong>From:</strong> {msg.name} (
                        <a href={`mailto:${msg.email}`} className="text-decoration-none">
                          {msg.email}
                        </a>
                        ) • <span>{formatDateTime(msg.createdAt)}</span>
                      </p>

                      <p className="mb-0 small bg-light p-2 rounded">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back Button */}
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

      {/* Footer */}
      <footer className="text-center">
        <p>💊 Online Pharmacy &amp; Medicine Reminder System</p>
        <p>© 2026 All Rights Reserved</p>
      </footer>
    </>
  );
}

export default Contact;