import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const API_URL = "https://sentinelx-1-t4j1.onrender.com";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState("email");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Resend OTP cooldown
  const [resendTimer, setResendTimer] = useState(0);

  // --------------------------------
  // Resend OTP Countdown
  // --------------------------------

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // --------------------------------
  // Send Password Reset OTP
  // --------------------------------

  const handleSendOTP = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to send reset OTP."
        );
      }

      setStep("otp");
      setOtp("");

      // Start resend cooldown
      setResendTimer(60);

      setMessage(
        "Password reset OTP sent. Check your email."
      );

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Resend Password Reset OTP
  // --------------------------------

  const handleResendOTP = async () => {
    if (!email.trim()) {
      setMessage("Email address is missing.");
      return;
    }

    if (resendTimer > 0) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to resend OTP."
        );
      }

      setOtp("");

      // Start new 60 second cooldown
      setResendTimer(60);

      setMessage(
        "New OTP sent successfully. Check your email."
      );

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Verify OTP
  // --------------------------------

  const handleVerifyOTP = async (event) => {
    event.preventDefault();

    if (!otp.trim()) {
      setMessage("Please enter the OTP.");
      return;
    }

    if (otp.trim().length !== 6) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/verify-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid OTP."
        );
      }

      setStep("password");

      setMessage(
        "OTP verified. Create your new password."
      );

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Reset Password
  // --------------------------------

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!newPassword) {
      setMessage("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to reset password."
        );
      }

      setMessage(
        "Password reset successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        {/* HEADER */}

        <div className="forgot-header">

          <div className="forgot-logo">
            🛡️
          </div>

          <h1>
            {step === "email" && "Forgot Password?"}
            {step === "otp" && "Verify OTP"}
            {step === "password" && "Create New Password"}
          </h1>

          <p>
            {step === "email" &&
              "Enter your email address to reset your password."}

            {step === "otp" &&
              "Enter the verification code sent to your email."}

            {step === "password" &&
              "Create a new secure password for your account."}
          </p>

        </div>


        {/* ================================= */}
        {/* STEP 1 — EMAIL */}
        {/* ================================= */}

        {step === "email" && (

          <form onSubmit={handleSendOTP}>

            <div className="form-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              className="forgot-button"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Send Reset OTP"}
            </button>

          </form>

        )}


        {/* ================================= */}
        {/* STEP 2 — VERIFY OTP */}
        {/* ================================= */}

        {step === "otp" && (

          <form onSubmit={handleVerifyOTP}>

            <div className="form-group">

              <label>Verification Code</label>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                inputMode="numeric"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />

            </div>


            {/* VERIFY OTP BUTTON */}

            <button
              type="submit"
              className="forgot-button"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>


            {/* RESEND OTP */}

            <button
              type="button"
              className="resend-otp-button"
              onClick={handleResendOTP}
              disabled={loading || resendTimer > 0}
            >
              {loading
                ? "Sending..."
                : resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}
            </button>

          </form>

        )}


        {/* ================================= */}
        {/* STEP 3 — NEW PASSWORD */}
        {/* ================================= */}

        {step === "password" && (

          <form onSubmit={handleResetPassword}>

            <div className="form-group">

              <label>New Password</label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

            </div>


            {/* RESET PASSWORD */}

            <button
              type="submit"
              className="forgot-button"
              disabled={loading}
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>

          </form>

        )}


        {/* ================================= */}
        {/* MESSAGE */}
        {/* ================================= */}

        {message && (
          <p className="forgot-message">
            {message}
          </p>
        )}


        {/* ================================= */}
        {/* BACK TO LOGIN */}
        {/* ================================= */}

        <div className="back-login">

          <Link to="/login">
            ← Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;