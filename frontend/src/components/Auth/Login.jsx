import { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setMessage("Login successful!");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          🛡️
        </div>

        <p className="login-label">SENTINELX SECURITY</p>

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Sign in to access your security dashboard.
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

          <button type="submit" className="login-button">
            Login
          </button>

        </form>

        <p className="register-link">
          Don't have an account? <span>Register</span>
        </p>

      </div>
    </div>
  );
}

export default Login;