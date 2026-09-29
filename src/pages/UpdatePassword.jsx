import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function UpdatePassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/update-password",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password updated successfully!");

        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error("Password update error:", error);

      alert("Unable to connect to server");
    }
  };

  return (
    <>
      {/* Navbar */}

      <nav className="navbar navbar-expand-lg">

        <div className="container">

          <Link className="navbar-brand" to="/">
            💊 Online Pharmacy
          </Link>

          <Link to="/login" className="nav-link">
            Back to Login
          </Link>

        </div>

      </nav>


      {/* Update Password */}

      <section className="login-section">

        <div className="container">

          <div className="row justify-content-center">

            <div className="col-lg-5 col-md-7">

              <div className="login-card">

                <div className="text-center mb-3">

                  <div className="register-icon">
                    🔐
                  </div>

                </div>

                <h2 className="text-center mb-2">
                  Update Password
                </h2>

                <p className="text-center text-muted mb-4">
                  Enter your email and create a new password.
                </p>


                <form onSubmit={handleUpdatePassword}>

                  {/* Email */}

                  <div className="mb-3">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />

                  </div>


                  {/* New Password */}

                  <div className="mb-3">

                    <label>
                      New Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      required
                    />

                  </div>


                  {/* Confirm Password */}

                  <div className="mb-4">

                    <label>
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      required
                    />

                  </div>


                  <button
                    type="submit"
                    className="btn btn-primary w-100 login-btn"
                  >
                    Update Password
                  </button>

                </form>


                <p className="text-center mt-4">

                  Remember your password?{" "}

                  <Link to="/login">
                    Login here
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


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

export default UpdatePassword;