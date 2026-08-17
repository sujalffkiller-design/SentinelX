import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://127.0.0.1:8000";

  // -----------------------------
  // Send OTP
  // -----------------------------

  const handleSendOTP = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!phone.trim()) {
      setMessage("Please enter your phone number.");
      return;
    }

    if (!password) {
      setMessage("Please create a password.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to send OTP.");
      }

      setOtpSent(true);
      setMessage("OTP sent successfully. Check your email.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Verify OTP
  // -----------------------------

  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid OTP.");
      }

      setVerified(true);
      setMessage("Email verified successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Create Account
  // -----------------------------

  const handleActivateAccount = async () => {
    console.log("Activating account...");
    console.log("API:", `${API_URL}/register`);
    console.log("Email:", email);
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone: phone,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create account."
        );
      }

      setMessage("Account created successfully.");

      // Go to Login
      setTimeout(() => {
        navigate("/login");
      }, 500);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-header">

          <div className="register-logo">
            🛡️
          </div>

          <h1>Create your SentinelX account</h1>

          <p>
            Protect your digital world with SentinelX.
          </p>

        </div>

        <form onSubmit={handleSendOTP}>

          {/* Full Name */}

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={verified}
            />

          </div>

          {/* Email */}

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={verified}
            />

          </div>

          {/* Phone */}

          <div className="form-group">

            <label>Phone Number</label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={verified}
            />

          </div>

          {/* Password */}

          <div className="form-group">

            <label>Password</label>

            <div className="password-input">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={verified}
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

          {/* Confirm Password */}

          <div className="form-group">

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              disabled={verified}
            />

          </div>

          {/* OTP */}

          {otpSent && !verified && (
            <div className="form-group">

              <label>Verification Code</label>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
              />

              <button
                type="button"
                className="register-button"
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

            </div>
          )}

          {/* Send OTP */}

          {!otpSent && !verified && (
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Send Verification Code"}
            </button>
          )}

          {/* Account Activated */}

          {verified && (
            <button
              type="button"
              className="register-button"
              onClick={handleActivateAccount}
              disabled={loading}
            >
              {loading
                ? "Activating Account..."
                : "✓ Account Activated"}
            </button>
          )}

          {/* Message */}

          {message && (
            <p className="register-message">
              {message}
            </p>
          )}

        </form>

        <div className="register-login">

          Already have an account?

          <a href="/login">
            {" "}Login
          </a>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;