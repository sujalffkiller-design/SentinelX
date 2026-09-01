import { useState } from "react";
import {
  Globe,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Lock,
  Network,
  Link2,
  Code2,
  Server,
  Activity,
} from "lucide-react";

import "./URLScanner.css";

const API_URL = "http://127.0.0.1:8000";

function URLScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!url.trim()) {
      setError("Please enter a URL to scan.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to analyze URL.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleScan();
    }
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  const getRiskClass = () => {
    if (!result) return "";

    if (result.risk_score >= 70) return "high";
    if (result.risk_score >= 30) return "medium";

    return "low";
  };

  const getRiskIcon = () => {
    if (!result) return <ShieldCheck size={28} />;

    if (result.risk_score >= 70) {
      return <ShieldAlert size={28} />;
    }

    if (result.risk_score >= 30) {
      return <AlertTriangle size={28} />;
    }

    return <ShieldCheck size={28} />;
  };

  const getRiskDescription = () => {
    if (!result) return "";

    if (result.risk_score >= 70) {
      return "Multiple high-risk indicators were detected.";
    }

    if (result.risk_score >= 30) {
      return "Some suspicious indicators were detected.";
    }

    return "No obvious security threats were detected.";
  };

  return (
    <div className="urlScannerPage">
      <div className="urlScannerContainer">

        {/* HEADER */}
        <header className="urlScannerHeader">
          <div className="urlScannerBadge">
            <Globe size={15} />
            SENTINELX SECURITY TOOL
          </div>

          <h1>
            URL <span>Scanner</span>
          </h1>

          <p>
            Analyze websites for phishing indicators, suspicious URLs,
            obfuscation techniques, and other security risks.
          </p>
        </header>


        {/* SCANNER CARD */}
        <section className="scannerCard">

          <div className="scannerCardHeader">
            <div className="scannerTitleIcon">
              <Search size={21} />
            </div>

            <div>
              <h2>Analyze a URL</h2>
              <p>
                Enter a website address to perform a security analysis.
              </p>
            </div>
          </div>


          <div className="urlInputWrapper">

            <div className="urlInputIcon">
              <Globe size={19} />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              aria-label="URL to scan"
            />

            <button
              className="scanButton"
              onClick={handleScan}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loadingSpinner"></span>
                  Scanning...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Scan URL
                </>
              )}
            </button>
          </div>


          {error && (
            <div className="urlError">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

        </section>


        {/* RESULTS */}
        {result && (
          <section className="scanResult">

            {/* RESULT TOP */}
            <div className="resultTop">

              <div>
                <div className="resultEyebrow">
                  <Activity size={14} />
                  SCAN COMPLETE
                </div>

                <h2>Security Analysis</h2>

                <p>
                  Analysis completed for the submitted website.
                </p>
              </div>

              <button
                className="newScanButton"
                onClick={handleReset}
              >
                <RotateCcw size={16} />
                New Scan
              </button>

            </div>


            {/* OVERVIEW GRID */}
            <div className="resultOverview">

              {/* RISK SCORE */}
              <div className={`riskCard ${getRiskClass()}`}>

                <div className="riskCardHeader">
                  <span>RISK ASSESSMENT</span>
                  <div className="riskIcon">
                    {getRiskIcon()}
                  </div>
                </div>

                <div className="riskScore">
                  {result.risk_score}
                  <small>/100</small>
                </div>

                <div className="riskLevel">
                  {result.risk_level}
                </div>

                <p>
                  {getRiskDescription()}
                </p>

                <div className="riskProgress">
                  <div
                    style={{
                      width: `${result.risk_score}%`,
                    }}
                  ></div>
                </div>

              </div>


              {/* SCANNED URL */}
              <div className="infoCard">

                <div className="infoCardTitle">
                  <Globe size={18} />
                  <span>SCANNED URL</span>
                </div>

                <div className="scannedUrl">
                  {result.url}
                </div>

                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="externalLink"
                >
                  Open website
                  <ExternalLink size={14} />
                </a>

              </div>


              {/* FINDINGS */}
              <div className="infoCard">

                <div className="infoCardTitle">
                  <AlertTriangle size={18} />
                  <span>SECURITY FINDINGS</span>
                </div>

                <div className="findingCount">
                  {result.findings?.length || 0}
                </div>

                <p>
                  {result.findings?.length === 1
                    ? "Indicator identified during analysis."
                    : "Indicators identified during analysis."}
                </p>

              </div>

            </div>


            {/* FINDINGS SECTION */}
            <div className="analysisSection">

              <div className="sectionHeading">
                <div>
                  <h3>
                    <AlertTriangle size={19} />
                    Detected Indicators
                  </h3>

                  <p>
                    Security signals identified during the scan.
                  </p>
                </div>
              </div>


              <div className="findingsList">

                {result.findings?.map((finding, index) => (
                  <div className="findingItem" key={index}>

                    <div className="findingNumber">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="findingIcon">
                      {result.risk_score >= 70 ? (
                        <ShieldAlert size={17} />
                      ) : result.risk_score >= 30 ? (
                        <AlertTriangle size={17} />
                      ) : (
                        <CheckCircle2 size={17} />
                      )}
                    </div>

                    <span>{finding}</span>

                  </div>
                ))}

              </div>

            </div>


            {/* SECURITY CHECKS */}
            <div className="analysisSection">

              <div className="sectionHeading">
                <div>
                  <h3>
                    <ShieldCheck size={19} />
                    Security Checks
                  </h3>

                  <p>
                    Indicators evaluated by the SentinelX URL engine.
                  </p>
                </div>
              </div>


              <div className="checksGrid">

                <div className="checkCard">
                  <Lock size={18} />
                  <span>HTTPS</span>
                  <CheckCircle2 size={15} />
                </div>

                <div className="checkCard">
                  <Network size={18} />
                  <span>IP Address</span>
                  <CheckCircle2 size={15} />
                </div>

                <div className="checkCard">
                  <Link2 size={18} />
                  <span>URL Length</span>
                  <CheckCircle2 size={15} />
                </div>

                <div className="checkCard">
                  <AlertTriangle size={18} />
                  <span>Suspicious Keywords</span>
                  <CheckCircle2 size={15} />
                </div>

                <div className="checkCard">
                  <Code2 size={18} />
                  <span>Obfuscation</span>
                  <CheckCircle2 size={15} />
                </div>

                <div className="checkCard">
                  <Globe size={18} />
                  <span>Subdomains</span>
                  <CheckCircle2 size={15} />
                </div>

                <div className="checkCard">
                  <Globe size={18} />
                  <span>Punycode</span>
                  <CheckCircle2 size={15} />
                </div>

                <div className="checkCard">
                  <Code2 size={18} />
                  <span>URL Encoding</span>
                  <CheckCircle2 size={15} />
                </div>

                <div className="checkCard">
                  <Server size={18} />
                  <span>Port Analysis</span>
                  <CheckCircle2 size={15} />
                </div>

              </div>

            </div>


            {/* FOOTER */}
            <div className="scanFooter">

              <div>
                <ShieldCheck size={17} />
                <span>
                  Analysis performed by SentinelX Security Engine
                </span>
              </div>

              <span>
                Automated URL analysis
              </span>

            </div>

          </section>
        )}


        {/* EMPTY STATE */}
        {!result && !loading && (
          <div className="scannerEmpty">

            <div className="emptyIcon">
              <ShieldCheck size={32} />
            </div>

            <h3>Ready to scan</h3>

            <p>
              Enter a URL above and SentinelX will analyze it for
              common security indicators.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default URLScanner;