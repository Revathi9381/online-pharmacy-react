function Profile() {
  return (
    <div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">

          <a className="navbar-brand" href="/dashboard">
            💊 Online Pharmacy
          </a>

          <div className="ms-auto">
            <a href="/dashboard" className="btn btn-custom">
              Back to Dashboard
            </a>
          </div>

        </div>
      </nav>


      {/* Profile Section */}
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


            {/* Profile Details */}
            <div className="profile-details">

              <div className="profile-item">
                <strong>Full Name</strong>
                <span>Revathi</span>
              </div>

              <div className="profile-item">
                <strong>Email</strong>
                <span>revathi123@gmail.com</span>
              </div>

              <div className="profile-item">
                <strong>Phone Number</strong>
                <span>Not added</span>
              </div>

              <div className="profile-item">
                <strong>Date of Birth</strong>
                <span>Not added</span>
              </div>

              <div className="profile-item">
                <strong>Gender</strong>
                <span>Not added</span>
              </div>

            </div>


            {/* Edit Profile */}
            <div className="text-center mt-4">

              <button
                className="btn btn-primary"
                onClick={() => alert("Edit Profile will be added next")}
              >
                ✏️ Edit Profile
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* Footer */}
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