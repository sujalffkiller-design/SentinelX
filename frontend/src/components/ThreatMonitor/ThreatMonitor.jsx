import "./ThreatMonitor.css";
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  Link2,
  Bug,
  Clock3,
} from "lucide-react";

const threats = [
  {
    icon: ShieldAlert,
    type: "PHISHING ATTEMPT",
    message: "Suspicious login page detected",
    time: "2 min ago",
    level: "MEDIUM",
  },
  {
    icon: Bug,
    type: "MALWARE DETECTED",
    message: "Suspicious executable blocked",
    time: "5 min ago",
    level: "HIGH",
  },
  {
    icon: Link2,
    type: "SUSPICIOUS URL",
    message: "Potential malicious redirect detected",
    time: "8 min ago",
    level: "LOW",
  },
  {
    icon: ShieldCheck,
    type: "THREAT BLOCKED",
    message: "Unauthorized connection prevented",
    time: "12 min ago",
    level: "SAFE",
  },
];

function ThreatMonitor() {
  return (
    <section className="threatSection">

      <div className="threatHeader">
        <div>
          <div className="sectionLabel">
            <span className="liveDot"></span>
            LIVE SECURITY MONITOR
          </div>

          <h2>
            Threats don't wait.
            <span> Neither do we.</span>
          </h2>

          <p>
            SentinelX continuously analyzes security activity
            and identifies suspicious behavior before it becomes
            a serious threat.
          </p>
        </div>

        <div className="systemStatus">
          <Activity size={22} />
          <div>
            <strong>System Status</strong>
            <span>
              <i></i> All Systems Operational
            </span>
          </div>
        </div>
      </div>

      <div className="threatPanel">

        <div className="monitorTop">
          <div>
            <span className="monitorIndicator"></span>
            LIVE THREAT FEED
          </div>

          <span>Monitoring activity...</span>
        </div>

        <div className="threatList">

          {threats.map((threat, index) => {
            const Icon = threat.icon;

            return (
              <div className="threatItem" key={index}>

                <div className="threatIcon">
                  <Icon size={21} />
                </div>

                <div className="threatInfo">
                  <strong>{threat.type}</strong>
                  <p>{threat.message}</p>
                </div>

                <div className="threatTime">
                  <Clock3 size={14} />
                  {threat.time}
                </div>

                <div className={`threatLevel ${threat.level.toLowerCase()}`}>
                  {threat.level}
                </div>

              </div>
            );
          })}

        </div>

        <div className="activityGraph">

          <div className="graphHeader">
            <span>Threat Activity</span>
            <span>Last 30 minutes</span>
          </div>

          <div className="bars">
            {[25, 42, 30, 60, 38, 75, 48, 90, 55, 68, 45, 80, 52, 70, 35, 60].map(
              (height, index) => (
                <div
                  className="bar"
                  key={index}
                  style={{ height: `${height}%` }}
                ></div>
              )
            )}
          </div>

        </div>

      </div>

    </section>
  );
}

export default ThreatMonitor;