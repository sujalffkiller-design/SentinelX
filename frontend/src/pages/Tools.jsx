import { Link } from "react-router-dom";
import "./Tools.css";

function Tools() {
  return (
    <div className="tools-page">

      {/* HEADER */}
      <div className="tools-header">
        <p>SECURITY TOOLS</p>

        <h1>SentinelX Security Suite</h1>

        <span>
          Choose a security tool to protect your digital world.
        </span>
      </div>


      {/* TOOLS GRID */}
      <div className="tools-grid">

        {/* =========================
            PHISHING DETECTOR
        ========================= */}

        <div className="tool-card">

          <div className="tool-icon">
            🔗
          </div>

          <h2>
            Phishing Detector
          </h2>

          <p>
            Analyze suspicious URLs and detect potential
            phishing threats.
          </p>

          <Link
            to="/phishing"
            className="tool-button"
          >
            Open Phishing Detector
          </Link>

        </div>


        {/* =========================
            URL SCANNER
        ========================= */}

        <div className="tool-card">

          <div className="tool-icon">
            🔎
          </div>

          <h2>
            URL Scanner
          </h2>

          <p>
            Perform a detailed security analysis of URLs
            and identify suspicious activity.
          </p>

          <Link
            to="/url-scanner"
            className="tool-button"
          >
            Open URL Scanner
          </Link>

        </div>


        {/* =========================
            MALWARE SCANNER
        ========================= */}

        <div className="tool-card">

          <div className="tool-icon">
            🛡️
          </div>

          <h2>
            Malware Scanner
          </h2>

          <p>
            Upload files and scan them for malware and
            suspicious activity.
          </p>

          <Link
            to="/malware"
            className="tool-button"
          >
            Open Malware Scanner
          </Link>

        </div>


        {/* =========================
            PASSWORD AUDITOR
        ========================= */}

        <div className="tool-card">

          <div className="tool-icon">
            🔐
          </div>

          <h2>
            Password Auditor
          </h2>

          <p>
            Check password strength and identify
            security weaknesses.
          </p>

          <Link
            to="/password"
            className="tool-button"
          >
            Open Password Auditor
          </Link>

        </div>


        {/* =========================
            SECURITY DASHBOARD
        ========================= */}

        <div className="tool-card">

          <div className="tool-icon">
            📊
          </div>

          <h2>
            Security Dashboard
          </h2>

          <p>
            Monitor your security activity, scan results,
            and overall protection status.
          </p>

          <Link
            to="/dashboard"
            className="tool-button"
          >
            Open Dashboard
          </Link>

        </div>


        {/* =========================
            SCAN HISTORY
        ========================= */}

        <div className="tool-card">

          <div className="tool-icon">
            🕒
          </div>

          <h2>
            Scan History
          </h2>

          <p>
            Review previous security scans and analyze
            your detected threats.
          </p>

          <Link
            to="/scan-history"
            className="tool-button"
          >
            View Scan History
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Tools;