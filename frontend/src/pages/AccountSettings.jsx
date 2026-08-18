import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AccountSettings.css";

function AccountSettings() {

  // =========================================
  // LOAD SAVED SETTINGS
  // =========================================

  const getSavedSettings = () => {
    try {
      const savedSettings = localStorage.getItem(
        "sentinelx_settings"
      );

      if (savedSettings) {
        return JSON.parse(savedSettings);
      }

    } catch (error) {
      console.error(
        "Error loading SentinelX settings:",
        error
      );
    }

    return null;
  };


  const savedSettings = getSavedSettings();


  // =========================================
  // DARK MODE
  // =========================================

  const [darkMode, setDarkMode] = useState(
    savedSettings?.darkMode ?? true
  );


  // =========================================
  // SECURITY ALERTS
  // =========================================

  const [securityAlerts, setSecurityAlerts] = useState(
    savedSettings?.securityAlerts ?? true
  );


  // =========================================
  // EMAIL NOTIFICATIONS
  // =========================================

  const [emailNotifications, setEmailNotifications] =
    useState(
      savedSettings?.emailNotifications ?? true
    );


  // =========================================
  // SAVE MESSAGE
  // =========================================

  const [saveMessage, setSaveMessage] = useState("");


  // =========================================
  // APPLY THEME
  // =========================================

  useEffect(() => {

    if (darkMode) {

      document.body.classList.remove(
        "light-mode"
      );

      document.documentElement.classList.remove(
        "light-mode"
      );

    } else {

      document.body.classList.add(
        "light-mode"
      );

      document.documentElement.classList.add(
        "light-mode"
      );

    }

  }, [darkMode]);


  // =========================================
  // SAVE SETTINGS AUTOMATICALLY
  // =========================================

  useEffect(() => {

    const settings = {
      darkMode,
      securityAlerts,
      emailNotifications,
    };

    localStorage.setItem(
      "sentinelx_settings",
      JSON.stringify(settings)
    );

  }, [
    darkMode,
    securityAlerts,
    emailNotifications
  ]);


  // =========================================
  // SAVE BUTTON
  // =========================================

  const handleSaveSettings = () => {

    const settings = {
      darkMode,
      securityAlerts,
      emailNotifications,
    };


    // Save to localStorage

    localStorage.setItem(
      "sentinelx_settings",
      JSON.stringify(settings)
    );


    // Apply theme immediately

    if (darkMode) {

      document.body.classList.remove(
        "light-mode"
      );

      document.documentElement.classList.remove(
        "light-mode"
      );

    } else {

      document.body.classList.add(
        "light-mode"
      );

      document.documentElement.classList.add(
        "light-mode"
      );

    }


    // Show success message

    setSaveMessage(
      "Settings saved successfully!"
    );


    // Remove message after 2 seconds

    setTimeout(() => {

      setSaveMessage("");

    }, 2000);

  };


  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="settings-page">

      <div className="settings-card">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="settings-header">

          <div className="settings-logo">
            ⚙️
          </div>

          <h1>
            Account Settings
          </h1>

          <p>
            Manage your SentinelX preferences
            and security settings.
          </p>

        </div>


        {/* =====================================
            APPEARANCE
        ===================================== */}

        <div className="settings-section">

          <h2>
            Appearance
          </h2>


          <div className="setting-item">

            <div className="setting-info">

              <span className="setting-icon">

                {darkMode
                  ? "🌙"
                  : "☀️"}

              </span>


              <div>

                <strong>

                  {darkMode
                    ? "Dark Mode"
                    : "Light Mode"}

                </strong>


                <p>

                  Use the{" "}

                  {darkMode
                    ? "dark"
                    : "light"}{" "}

                  theme across SentinelX.

                </p>

              </div>

            </div>


            {/* SWITCH */}

            <label className="switch">

              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => {

                  setDarkMode(
                    (previous) => !previous
                  );

                }}
              />

              <span className="slider"></span>

            </label>

          </div>

        </div>


        {/* =====================================
            SECURITY
        ===================================== */}

        <div className="settings-section">

          <h2>
            Security
          </h2>


          {/* -------------------------------------
              SECURITY ALERTS
          ------------------------------------- */}

          <div className="setting-item">

            <div className="setting-info">

              <span className="setting-icon">
                🛡️
              </span>


              <div>

                <strong>
                  Security Alerts
                </strong>

                <p>
                  Get notified about suspicious
                  activity.
                </p>

              </div>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                checked={securityAlerts}
                onChange={() => {

                  setSecurityAlerts(
                    (previous) => !previous
                  );

                }}
              />

              <span className="slider"></span>

            </label>

          </div>


          {/* -------------------------------------
              EMAIL NOTIFICATIONS
          ------------------------------------- */}

          <div className="setting-item">

            <div className="setting-info">

              <span className="setting-icon">
                📧
              </span>


              <div>

                <strong>
                  Email Notifications
                </strong>

                <p>
                  Receive important SentinelX
                  security emails.
                </p>

              </div>

            </div>


            <label className="switch">

              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => {

                  setEmailNotifications(
                    (previous) => !previous
                  );

                }}
              />

              <span className="slider"></span>

            </label>

          </div>

        </div>


        {/* =====================================
            SAVE SETTINGS
        ===================================== */}

        <button
          className="settings-save-button"
          onClick={handleSaveSettings}
        >

          Save Settings

        </button>


        {/* =====================================
            SUCCESS MESSAGE
        ===================================== */}

        {saveMessage && (

          <p className="settings-message">

            {saveMessage}

          </p>

        )}


        {/* =====================================
            BACK TO HOME
        ===================================== */}

        <div className="settings-back">

          <Link to="/">

            ← Back to Home

          </Link>

        </div>


      </div>

    </div>

  );
}

export default AccountSettings;