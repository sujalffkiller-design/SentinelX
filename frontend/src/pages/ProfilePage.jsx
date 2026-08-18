import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("sentinelx_user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  const handleSaveProfile = (event) => {
    event.preventDefault();

    if (!fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    const updatedUser = {
      ...user,
      full_name: fullName.trim(),
      email: email,
    };

    localStorage.setItem(
      "sentinelx_user",
      JSON.stringify(updatedUser)
    );

    setMessage("Profile updated successfully!");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* HEADER */}

        <div className="profile-header">

          <div className="profile-logo">
            👤
          </div>

          <h1>Edit Account</h1>

          <p>
            Update your SentinelX account information.
          </p>

        </div>


        {/* PROFILE FORM */}

        <form onSubmit={handleSaveProfile}>

          <div className="profile-form-group">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
            />

          </div>


          <div className="profile-form-group">

            <label>Email Address</label>

            <input
              type="email"
              value={email}
              disabled
            />

            <small>
              Email address cannot be changed here.
            </small>

          </div>


          {/* SAVE */}

          <button
            type="submit"
            className="profile-save-button"
          >
            Save Changes
          </button>

        </form>


        {/* MESSAGE */}

        {message && (
          <p className="profile-message">
            {message}
          </p>
        )}


        {/* BACK */}

        <div className="profile-back">

          <Link to="/">
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ProfilePage;