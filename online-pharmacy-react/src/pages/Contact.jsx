import { Link } from "react-router-dom";

function Contact() {
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
              We're here to help with your healthcare needs.
            </p>
          </div>

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
                  support@onlinepharmacy.com
                </p>

                <p>
                  <strong>📞 Phone</strong>
                  <br />
                  +91 98765 43210
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

              </div>

            </div>

            {/* Contact Form */}
            <div className="col-md-6">

              <div className="card shadow-sm p-4">

                <h3 className="mb-4">
                  💬 Send us a Message
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Your message has been submitted successfully!");
                  }}
                >

                  <div className="mb-3">
                    <label className="form-label">
                      Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Message
                    </label>

                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Enter your message"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Send Message
                  </button>

                </form>

              </div>

            </div>

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

export default Contact;