import { useState } from "react";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Registration form is ready.");
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-logo">
          🛡️
        </div>

        <p className="register-label">SENTINELX SECURITY</p>

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Create your SentinelX security account.
        </p>

        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

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
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {message && (
            <p className="register-message">
              {message}
            </p>
          )}

          <button type="submit" className="register-button">
            Create Account
          </button>

        </form>

        <p className="login-link">
          Already have an account? <span>Login</span>
        </p>

      </div>
    </div>
  );
}

export default Register;