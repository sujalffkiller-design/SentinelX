import { useState } from "react";
import { Lock, ShieldCheck, AlertTriangle, CheckCircle } from "lucide-react";
import "./PasswordAuditor.css";

function PasswordAuditor() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);

  const analyzePassword = () => {
    if (!password) {
      setResult({
        type: "error",
        message: "Please enter a password first.",
      });
      return;
    }

    let score = 0;
    const findings = [];

    if (password.length >= 8) score += 25;
    else findings.push("Password should contain at least 8 characters.");

    if (password.length >= 12) score += 15;

    if (/[A-Z]/.test(password)) score += 15;
    else findings.push("Add at least one uppercase letter.");

    if (/[a-z]/.test(password)) score += 10;
    else findings.push("Add at least one lowercase letter.");

    if (/[0-9]/.test(password)) score += 15;
    else findings.push("Add at least one number.");

    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    else findings.push("Add a special character.");

   let level = "WEAK";

  if (score >= 80) {
    level = "STRONG";
  } else if (score >= 50) {
    level = "MODERATE";
  }

   setResult({
      type: "success",
      score,
      level,
      findings,
    });

    const historyItem = {
      tool: "Password Auditor",
      target: "Password Audit",
      risk_score: score,
      risk_level: level,
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

  };

  return (
    <section id="password-auditor">
      <div className="password-header">
        <div className="password-icon">
          <Lock size={34} />
        </div>

        <div>
          <p className="password-label">
            SENTINELX SECURITY TOOL
          </p>

          <h1>
            Password <span>Auditor</span>
          </h1>

          <p>
            Check password strength and identify weaknesses
            before attackers can exploit them.
          </p>
        </div>
      </div>

      <div className="password-card">

        <div className="password-input-area">
          <label>Enter a password to audit</label>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setResult(null);
            }}
            placeholder="Enter password..."
          />

          <button
            className="audit-button"
            onClick={analyzePassword}
          >
            <ShieldCheck size={20} />
            Audit Password
          </button>
        </div>

        {result?.type === "error" && (
          <div className="password-error">
            <AlertTriangle size={22} />
            <span>{result.message}</span>
          </div>
        )}

        {result?.type === "success" && (
          <div className={`password-result ${result.level.toLowerCase()}`}>

            <div className="result-top">

              {result.level === "STRONG" ? (
                <CheckCircle size={35} />
              ) : (
                <AlertTriangle size={35} />
              )}

              <div>
                <p>SECURITY ANALYSIS</p>

                <h2>{result.level}</h2>
              </div>

              <div className="password-score">
                {result.score}/100
              </div>

            </div>

            {result.findings.length > 0 && (
              <div className="password-findings">
                <h3>Recommendations</h3>

                {result.findings.map((finding, index) => (
                  <div className="finding" key={index}>
                    <AlertTriangle size={18} />
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            )}

            {result.findings.length === 0 && (
              <div className="password-safe">
                <CheckCircle size={20} />
                Password meets SentinelX security requirements.
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}

export default PasswordAuditor;