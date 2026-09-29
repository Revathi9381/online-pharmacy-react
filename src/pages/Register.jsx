import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const fullName = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const dob = form.dob.value;
    const gender = form.gender.value;
    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;

    // ================= EMAIL VALIDATION =================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      alert("Please enter your email address");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // ================= PASSWORD VALIDATION =================

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // ================= PHONE VALIDATION =================

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      // ================= REGISTER USER =================

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName,
            email,
            phone,
            dob,
            gender,
            password,
          }),
        }
      );

      const data = await response.json();

      // ================= SUCCESS =================

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg">
        <div className="container">

          <Link className="navbar-brand" to="/">
            💊 Online Pharmacy
          </Link>

          <div className="ms-auto d-flex align-items-center">

            <Link to="/" className="nav-link me-3">
              Home
            </Link>

            <Link to="/login" className="btn btn-custom">
              Login
            </Link>

          </div>
        </div>
      </nav>

      {/* ================= REGISTER SECTION ================= */}

      <section className="register-section">

        <div className="container">

          <div className="row justify-content-center">

            <div className="col-lg-7 col-md-9">

              <div className="register-card">

                {/* Heading */}

                <div className="text-center mb-4">

                  <div className="register-icon">
                    💙
                  </div>

                  <h1>Create Your Account</h1>

                  <p>
                    Join our smart healthcare community
                  </p>

                </div>

                {/* ================= REGISTER FORM ================= */}

                <form onSubmit={handleSubmit}>

                  {/* Full Name */}

                  <div className="mb-3">

                    <label htmlFor="name">
                      Full Name
                    </label>

                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Enter your full name"
                      required
                    />

                  </div>

                  {/* Email + Phone */}

                  <div className="row">

                    <div className="col-md-6 mb-3">

                      <label htmlFor="email">
                        Email Address
                      </label>

                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="example@email.com"
                        required
                      />

                    </div>

                    <div className="col-md-6 mb-3">

                      <label htmlFor="phone">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-control"
                        placeholder="Enter 10-digit phone number"
                        maxLength="10"
                        required
                      />

                    </div>

                  </div>

                  {/* Date of Birth + Gender */}

                  <div className="row">

                    <div className="col-md-6 mb-3">

                      <label htmlFor="dob">
                        Date of Birth
                      </label>

                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        className="form-control"
                        required
                      />

                    </div>

                    <div className="col-md-6 mb-3">

                      <label htmlFor="gender">
                        Gender
                      </label>

                      <select
                        id="gender"
                        name="gender"
                        className="form-control"
                        required
                      >

                        <option value="">
                          Select Gender
                        </option>

                        <option value="male">
                          Male
                        </option>

                        <option value="female">
                          Female
                        </option>

                        <option value="other">
                          Other
                        </option>

                        <option value="prefer-not">
                          Prefer not to say
                        </option>

                      </select>

                    </div>

                  </div>

                  {/* Password + Confirm Password */}

                  <div className="row">

                    <div className="col-md-6 mb-3">

                      <label htmlFor="password">
                        Password
                      </label>

                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Create password"
                        minLength="6"
                        required
                      />

                    </div>

                    <div className="col-md-6 mb-3">

                      <label htmlFor="confirm-password">
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        id="confirm-password"
                        name="confirm_password"
                        className="form-control"
                        placeholder="Confirm password"
                        minLength="6"
                        required
                      />

                    </div>

                  </div>

                  {/* Terms */}

                  <div className="form-check mb-4">

                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="terms"
                      required
                    />

                    <label
                      className="form-check-label"
                      htmlFor="terms"
                    >
                      I agree to the{" "}

                      <a href="#">
                        Terms & Conditions
                      </a>
                    </label>

                  </div>

                  {/* Register Button */}

                  <button
                    type="submit"
                    className="btn btn-primary register-btn"
                  >
                    Create Account
                  </button>

                </form>

                {/* Login Link */}

                <p className="text-center login-text">

                  Already have an account?{" "}

                  <Link to="/login">
                    Login here
                  </Link>

                </p>

              </div>

            </div>

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

export default Register;