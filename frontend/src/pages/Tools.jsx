import { Link } from "react-router-dom";
import "./Tools.css";

function Tools() {
  return (
    <div className="tools-page">
      <div className="tools-header">
        <p>SECURITY TOOLS</p>
        <h1>SentinelX Security Suite</h1>
        <span>
          Choose a security tool to protect your digital world.
        </span>
      </div>

      <div className="tools-grid">

        <div className="tool-card">
          <div className="tool-icon">🔗</div>
          <h2>Phishing Detector</h2>
          <p>
            Analyze suspicious URLs and detect potential phishing threats.
          </p>

          <Link to="/phishing" className="tool-button">
            Open Phishing Detector
            </Link>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🛡️</div>
          <h2>Malware Scanner</h2>
          <p>
            Upload files and scan them for malware and suspicious activity.
          </p>

         <Link to="/malware" className="tool-button">
        Open Malware Scanner
        </Link>
        </div>

        <div className="tool-card">
          <div className="tool-icon">🔐</div>
          <h2>Password Auditor</h2>
          <p>
            Check password strength and identify security weaknesses.
          </p>

          <Link to="/password" className="tool-button">
            Open Password Auditor
            </Link>
        </div>

      </div>
    </div>
  );
}

export default Tools;