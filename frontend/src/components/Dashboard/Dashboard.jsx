import "./Dashboard.css";
import ScanHistory from "../ScanHistory/ScanHistory";
import { useState } from "react";

function Dashboard() {

const [history] = useState(() => {
  const savedHistory = localStorage.getItem("sentinelx_scan_history");

  

  return savedHistory ? JSON.parse(savedHistory) : [];
});

  const threatsDetected = history.length;

    const highRiskThreats = history.filter(
    (item) =>
      item.risk_level === "HIGH RISK" ||
      item.risk_level === "HIGH"
  ).length;

  const suspiciousThreats = history.filter(
    (item) =>
      item.risk_level === "SUSPICIOUS" ||
      item.risk_level === "MODERATE"
  ).length;

  const securityScore =
    history.length === 0
      ? 100
      : Math.max(
          0,
          Math.round(
            100 -
              history.reduce(
                (total, item) => total + (item.risk_score || 0),
                0
              ) / history.length
          )
        );

  return (

    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-label">SECURITY OVERVIEW</p>
          <h1>Security Dashboard</h1>
          <p className="dashboard-subtitle">
            Monitor your digital security and detect threats in real time.
          </p>
        </div>

        <div className="protection-status">
          <span className="status-dot"></span>
          Protection Active
        </div>
      </div>

      <div className="dashboard-stats">

        <div className="dashboard-card">
          <div className="card-icon">🛡️</div>
          <p>Security Score</p>
          <h2>{securityScore}<span>/100</span></h2>
          <small>Excellent protection</small>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">⚠️</div>
          <p>Threats Detected</p>
          <h2>{threatsDetected}</h2>
          <small>{highRiskThreats} high-risk threats</small>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🔍</div>
          <p>Suspicious Threats</p>
          <h2>{suspiciousThreats}</h2>
          <small>Requires attention</small>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">⚡</div>
          <p>Risk Level</p>
          <h2
            className={
              securityScore >= 80
                ? "risk-low"
                : securityScore >= 50
                ? "risk-medium"
                : "risk-high"
            }
          >
            {securityScore >= 80
              ? "LOW"
              : securityScore >= 50
              ? "MEDIUM"
              : "HIGH"}
          </h2>

          <small>
            {securityScore >= 80
              ? "Your system is secure"
              : securityScore >= 50
              ? "Some threats need attention"
              : "Immediate attention required"}
          </small>
        </div>

      </div>

      <div className="dashboard-content">

        <div className="activity-card">
          <div className="section-title">
            <div>
              <p className="dashboard-label">RECENT ACTIVITY</p>
              <h2>Security Activity</h2>
            </div>

            <button
              className="view-all"
              onClick={() => {
                document
                  .getElementById("scan-history")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View All
            </button>
          </div>

                  {history.length === 0 ? (
          <div className="activity-item">
            <div className="activity-icon">🛡️</div>

            <div>
              <h3>No scans yet</h3>
              <p>Run a security scan to see activity here.</p>
            </div>

            <span className="safe-badge">READY</span>
          </div>
        ) : (
          history.slice(0, 5).map((item, index) => (
            <div className="activity-item" key={index}>
              <div className="activity-icon">
                {item.tool === "Phishing Detector"
                  ? "🔎"
                  : item.tool === "Malware Scanner"
                  ? "🦠"
                  : "🛡️"}
              </div>

              <div>
                <h3>{item.tool}</h3>
                <p>{item.target || "Security scan completed"}</p>
              </div>

              <span
                className={
                  item.risk_level === "HIGH RISK" ||
                  item.risk_level === "HIGH"
                    ? "danger-badge"
                    : item.risk_level === "SUSPICIOUS" ||
                      item.risk_level === "MODERATE"
                    ? "warning-badge"
                    : "safe-badge"
                }
              >
                {item.risk_level || "SAFE"}
              </span>
            </div>
          ))
        )}

        <div className="quick-card">
          <p className="dashboard-label">QUICK ACTIONS</p>
          <h2>Run Security Scan</h2>

         <button
        onClick={() =>
            document
            .getElementById("phishing-detector")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        >
        🔗 Phishing Detector
        </button>

        <button
        onClick={() =>
            document
            .getElementById("malware-scanner")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        >
        📁 Malware Scanner
        </button>

        <button
        onClick={() =>
            document
            .getElementById("password-auditor")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        >
        🔑 Password Auditor
        </button>

        </div>

      </div>

      </div>

      <ScanHistory />
    </section>
  );
}

export default Dashboard;