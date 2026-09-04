import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://sentinelx-1-t4j1.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed.");
      }

      // Save JWT token
      localStorage.setItem(
        "sentinelx_token",
        data.access_token
      );

      // Save user information
      localStorage.setItem(
        "sentinelx_user",
        JSON.stringify(data.user)
      );

      console.log("Logged in user:", data.user);

      setMessage("Login successful!");

      // Go to dashboard
      setMessage("Login successful!");

    setTimeout(() => {
    navigate("/");
    }, 500);

    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <div className="login-logo">
            🛡️
          </div>

          <h1>Welcome back</h1>

          <p>
            Sign in to your SentinelX account.
          </p>

        </div>

        <form onSubmit={handleLogin}>

          {/* Email */}

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          {/* Password */}

          <div className="form-group">

            <label>Password</label>

            <div className="password-input">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          {/* Forgot Password */}

          <div className="forgot-password">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          {/* Login */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* Message */}

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

        </form>

        <div className="login-register">

          Don't have an account?

          <Link to="/register">
            {" "}Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;