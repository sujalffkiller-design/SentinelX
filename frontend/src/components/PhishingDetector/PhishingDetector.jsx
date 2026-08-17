import { useState } from "react";
import { Search, AlertTriangle } from "lucide-react";
import "./PhishingDetector.css";

function PhishingDetector() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeURL = async () => {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to analyze URL.");
      }

      const data = await response.json();
      const historyItem = {
      tool: "Phishing Detector",
      target: url.trim(),
      risk_score: data.risk_score ?? 0,
      risk_level: data.risk_level ?? "LOW RISK",
      date: new Date().toLocaleString(),
    };

    const existingHistory = JSON.parse(
      localStorage.getItem("sentinelx_scan_history") || "[]"
    );

    existingHistory.unshift(historyItem);

    localStorage.setItem(
      "sentinelx_scan_history",
      JSON.stringify(existingHistory)
    );

    setResult(data);

      setResult(data);
    } catch {
    setError(
        "Could not connect to SentinelX Security API. Make sure the backend is running."
    );
    }finally {
      setLoading(false);
    }
  };

  

  const getRiskClass = () => {
    if (!result) return "";

    if (result.risk_level === "HIGH RISK") {
      return "risk-high";
    }

    if (result.risk_level === "SUSPICIOUS") {
      return "risk-suspicious";
    }

    return "risk-low";
  };

  return (
    <section  id="phishing-detector">

      <div className="phishingHeader">
        <span>SECURITY TOOL</span>

        <h2>
          Phishing <strong>Detector</strong>
        </h2>

        <p>
          Analyze suspicious URLs and identify potential phishing indicators
          before interacting with them.
        </p>
      </div>

      <div className="phishingCard">

        <div className="phishingInputArea">

          <div className="inputIcon">
            <Search size={20} />
          </div>

          <input
            type="url"
            placeholder="Enter suspicious URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                analyzeURL();
              }
            }}
          />

          <button
            onClick={analyzeURL}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze URL"}
          </button>

        </div>

        {error && (
          <div className="phishingError">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {result && (
        <div className={`analysis-result ${getRiskClass()}`}>

          <div className="result-header">
            <div>
              <span className="result-label">SECURITY ANALYSIS</span>

              <h2>
                {result.risk_level}
              </h2>
            </div>

            <div className="risk-score">
              <span>RISK SCORE</span>
              <strong>{result.risk_score}/100</strong>
            </div>
          </div>

          <div className="result-divider" />

          <div className="analyzed-url">
            <span>Analyzed URL</span>
            <p>{result.url}</p>
          </div>

          <h3>Analysis Findings</h3>

          <div className="findings-list">
            {result.findings.map((finding, index) => (
              <div className="finding" key={index}>
                <span className="finding-icon">⚠</span>
                <span>{finding}</span>
              </div>
            ))}
          </div>

          <div className="checks-section">
            <h3>Security Checks Performed</h3>

            <div className="checks-grid">
              {result.checks_performed?.map((check, index) => (
                <div className="check-item" key={index}>
                  <span>✓</span>
                  {check}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      </div>

    </section>
  );
}

export default PhishingDetector;