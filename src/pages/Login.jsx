import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        alert("Login successful!");

        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed. Please check your credentials or database.");
      }
    } catch (error) {
      console.error("Login network error:", error);

      alert("Unable to connect to backend server. Please verify backend is running.");
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

            <Link
              to="/register"
              className="btn btn-custom"
            >
              Register
            </Link>

          </div>

        </div>
      </nav>


      {/* ================= LOGIN SECTION ================= */}

      <section className="login-section">

        <div className="container">

          <div className="row justify-content-center align-items-center">

            <div className="col-lg-5 col-md-7">

              <div className="login-card">

                {/* Login Icon */}

                <div className="text-center mb-3">

                  <div className="register-icon">
                    💙
                  </div>

                </div>


                {/* Heading */}

                <h2 className="text-center mb-2">
                  Welcome Back!
                </h2>

                <p className="text-center text-muted mb-4">
                  Login to manage your medicines and healthcare.
                </p>


                {/* ================= LOGIN FORM ================= */}

                <form onSubmit={handleSubmit}>

                  {/* Email */}

                  <div className="mb-3">

                    <label htmlFor="email">
                      Email Address
                    </label>

                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />

                  </div>


                  {/* Password */}

                  <div className="mb-3">

                    <label htmlFor="password">
                      Password
                    </label>

                    <div
                      style={{
                        position: "relative"
                      }}
                    >

                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter your password"
                        required
                        style={{
                          paddingRight: "50px"
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: "20px",
                          padding: "0"
                        }}
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>

                    </div>

                  </div>


                  {/* Remember Me + Forgot Password */}

                  <div className="d-flex justify-content-between align-items-center mb-4">

                    <div className="form-check">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                      />

                      <label
                        className="form-check-label"
                        htmlFor="remember"
                      >
                        Remember me
                      </label>

                    </div>


                    <Link
                      to="/update-password"
                      className="forgot-link"
                    >
                      Forgot Password?
                    </Link>

                  </div>


                  {/* Login Button */}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 login-btn"
                  >
                    Login
                  </button>

                </form>


                {/* Register Link */}

                <p className="text-center mt-4">

                  Don't have an account?{" "}

                  <Link to="/register">
                    Register here
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
          💊 Online Pharmacy & AI Medicine Reminder
        </p>

        <p>
          © 2026 All Rights Reserved
        </p>

      </footer>

    </>
  );
}

export default Login;