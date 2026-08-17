import { useState } from "react";
import {
  History,
  ShieldCheck,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import "./ScanHistory.css";

function ScanHistory() {
  const [history, setHistory] = useState(() => {
  const savedHistory = localStorage.getItem("sentinelx_scan_history");

  if (!savedHistory) {
    return [];
  }

  try {
    return JSON.parse(savedHistory);
  } catch {
    return [];
  }
});

  const clearHistory = () => {
    localStorage.removeItem("sentinelx_scan_history");
    setHistory([]);
  };

  return (
    <section id="scan-history" className="scan-history">
      <div className="history-header">
        <div className="history-title">
          <div className="history-icon">
            <History size={28} />
          </div>

          <div>
            <p className="history-label">SENTINELX SECURITY</p>
            <h1>Scan History</h1>
            <p>
              Review your previous security scans and detected risks.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            className="clear-history"
            onClick={clearHistory}
          >
            <Trash2 size={17} />
            Clear History
          </button>
        )}
      </div>

      <div className="history-card">

        {history.length === 0 ? (
          <div className="empty-history">
            <ShieldCheck size={45} />

            <h2>No Scan History</h2>

            <p>
              Your completed security scans will appear here.
            </p>
          </div>
        ) : (
          <div className="history-list">

            {history.map((item, index) => (
              <div className="history-item" key={index}>

                <div className="history-tool-icon">
                  {item.tool === "Phishing Detector" ? (
                    "🔗"
                  ) : item.tool === "Malware Scanner" ? (
                    "📁"
                  ) : (
                    "🔐"
                  )}
                </div>

                <div className="history-info">
                  <h3>{item.tool}</h3>

                  <p>
                    {item.target}
                  </p>

                  <small>
                    {item.date}
                  </small>
                </div>

                <div className="history-risk">
                  <strong>
                    {item.risk_score ?? 0}/100
                  </strong>

                  <span
                    className={
                      item.risk_level === "HIGH RISK"
                        ? "risk-high"
                        : item.risk_level === "SUSPICIOUS"
                        ? "risk-medium"
                        : "risk-low"
                    }
                  >
                    {item.risk_level || "LOW RISK"}
                  </span>
                </div>

                <div className="history-status">
                  {item.risk_level === "HIGH RISK" ? (
                    <AlertTriangle size={20} />
                  ) : (
                    <ShieldCheck size={20} />
                  )}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default ScanHistory;