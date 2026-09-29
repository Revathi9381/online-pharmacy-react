import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Profile() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      setUser(savedUser);
    }

  }, []);


  return (
    <div>

      {/* ================= NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg">

        <div className="container">

          <Link
            className="navbar-brand"
            to="/dashboard"
          >
            💊 Online Pharmacy
          </Link>

          <div className="ms-auto">

            <Link
              to="/dashboard"
              className="btn btn-custom"
            >
              ← Back to Dashboard
            </Link>

          </div>

        </div>

      </nav>


      {/* ================= PROFILE ================= */}

      <section className="profile-section">

        <div className="container">

          <div className="profile-card">

            {/* Heading */}

            <div className="text-center mb-4">

              <div className="profile-icon">
                👤
              </div>

              <h1>My Profile</h1>

              <p>
                View and manage your personal information
              </p>

            </div>


            {/* ================= PERSONAL INFORMATION ================= */}

            <h4 className="mb-3">
              👤 Personal Information
            </h4>

            <div className="profile-details">

              <div className="profile-item">
                <strong>Full Name</strong>

                <span>
                  {user?.fullName || "Not available"}
                </span>

              </div>


              <div className="profile-item">
                <strong>Email</strong>

                <span>
                  {user?.email || "Not available"}
                </span>

              </div>


              <div className="profile-item">
                <strong>Phone Number</strong>

                <span>
                  {user?.phone || "Not available"}
                </span>

              </div>


              <div className="profile-item">
                <strong>Date of Birth</strong>

                <span>
                  {user?.dob
                    ? new Date(user.dob).toLocaleDateString()
                    : "Not available"}
                </span>

              </div>


              <div className="profile-item">
                <strong>Gender</strong>

                <span>
                  {user?.gender || "Not available"}
                </span>

              </div>

            </div>


            {/* ================= QUICK ACCESS ================= */}

            <h4 className="mt-5 mb-3">
              🏥 Medicine Management
            </h4>


            <div className="row g-3">


              {/* Medicines */}

              <div className="col-md-6 col-lg-3">

                <Link
                  to="/medicines"
                  className="profile-feature"
                >
                  💊
                  <strong>Medicines</strong>
                  <small>View medicines</small>
                </Link>

              </div>


              {/* Schedule */}

              <div className="col-md-6 col-lg-3">

                <Link
                  to="/schedule"
                  className="profile-feature"
                >
                  📅
                  <strong>Schedule</strong>
                  <small>Medicine timings</small>
                </Link>

              </div>


              {/* Reminder */}

              <div className="col-md-6 col-lg-3">

                <Link
                  to="/reminder"
                  className="profile-feature"
                >
                  🔔
                  <strong>AI Reminder</strong>
                  <small>Medicine alerts</small>
                </Link>

              </div>


              {/* History */}

              <div className="col-md-6 col-lg-3">

                <Link
                  to="/history"
                  className="profile-feature"
                >
                  📋
                  <strong>History</strong>
                  <small>Medicine history</small>
                </Link>

              </div>

            </div>


            {/* ================= CARETAKER ================= */}

            <div className="caretaker-profile-box mt-4">

              <div>

                <h4>
                  👨‍👩‍👧 Caretaker Support
                </h4>

                <p>
                  Allow a family member or caretaker to monitor
                  medicine schedules and intake.
                </p>

              </div>

              <Link
                to="/caretaker"
                className="btn btn-success"
              >
                Configure Caretaker
              </Link>

            </div>


            {/* ================= EDIT PROFILE ================= */}

            <div className="text-center mt-4">

              <button
                className="btn btn-primary"
                onClick={() =>
                  alert("Edit Profile will be added next")
                }
              >
                ✏️ Edit Profile
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="text-center">

        <p>
          💊 Online Pharmacy & AI Medicine Reminder
        </p>

        <p>
          © 2026 All Rights Reserved
        </p>

      </footer>

    </div>
  );
}

export default Profile;