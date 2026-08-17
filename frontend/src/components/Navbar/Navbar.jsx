import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  const token = localStorage.getItem("sentinelx_token");
  const savedUser = localStorage.getItem("sentinelx_user");

  const user = savedUser ? JSON.parse(savedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("sentinelx_token");
    localStorage.removeItem("sentinelx_user");

    setShowProfile(false);

    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="leftSide">

        <Link to="/" className="logo">
          <span className="logoIcon">🛡</span>

          <h2>
            Sentinel<span>X</span>
          </h2>
        </Link>

        <ul className="navLinks">

          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/features">Features</Link>
          </li>

          <li>
            <Link to="/tools">Tools</Link>
          </li>

          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>

        </ul>

      </div>

      <div className="navButtons">

        {!token ? (
          <>
            <Link to="/login" className="nav-login">
              LOGIN
            </Link>

            <Link to="/register" className="nav-get-started">
              REGISTER
            </Link>
          </>
        ) : (
          <div className="profile-container">

            <button
              className="profile-button"
              onClick={() => setShowProfile(!showProfile)}
            >
              <span className="profile-icon">👤</span>

              <span className="profile-name">
                {user?.full_name || "Profile"}
              </span>

              <span className="profile-arrow">
                {showProfile ? "▲" : "▼"}
              </span>
            </button>

            {showProfile && (
              <div className="profile-menu">

                <div className="profile-info">

                  <div className="profile-avatar">
                    👤
                  </div>

                  <div>
                    <strong>
                      {user?.full_name || "User"}
                    </strong>

                    <p>
                      {user?.email || ""}
                    </p>
                  </div>

                </div>

                <div className="profile-divider" />

                <button
                  onClick={() => navigate("/profile")}
                >
                  👤 Edit Account
                </button>

                <button
                  onClick={() => navigate("/change-password")}
                >
                  🔐 Change Password
                </button>

                <button
                  onClick={() => navigate("/settings")}
                >
                  ⚙️ Account Settings
                </button>

                <div className="profile-divider" />

                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>

              </div>
            )}

          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;