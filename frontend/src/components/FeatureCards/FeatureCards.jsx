import "./FeatureCards.css";
import {
  ShieldCheck,
  Fish,
  LockKeyhole,
  Globe,
  BarChart3,
  Bot,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const tools = [
  {
    icon: ShieldCheck,
    title: "Malware Scanner",
    desc: "Upload files and detect malware, ransomware, and other threats.",
    action: "Scan Now",
    path: "/malware",
  },
  {
    icon: Fish,
    title: "Phishing Detector",
    desc: "Detect phishing links, emails, and fake websites instantly.",
    action: "Check Now",
    path: "/phishing",
  },
  {
    icon: LockKeyhole,
    title: "Password Security",
    desc: "Check password strength and identify weak passwords.",
    action: "Audit Password",
    path: "/password",
  },
  {
    icon: Globe,
    title: "URL Scanner",
    desc: "Scan URLs for malware, phishing, and security risks.",
    action: "Analyze URL",
  },
  {
    icon: BarChart3,
    title: "Security Dashboard",
    desc: "Monitor scans, reports, and your security activity.",
    action: "View Dashboard",
  },
  {
    icon: Bot,
    title: "AI Cyber Assistant",
    desc: "Ask cybersecurity questions and get AI-powered answers.",
    action: "Chat with AI",
  },
];

function FeatureCards() {
  const navigate = useNavigate();

  return (
    <section className="featuresSection">
      <h2>
        Powerful Tools for <span>Complete Protection</span>
      </h2>

      <div className="featureGrid">
        {tools.map((tool, index) => (
          <div className="featureCard" key={index}>
            <tool.icon size={34} className="featureIcon" />

            <h3>{tool.title}</h3>

            <p>{tool.desc}</p>

            <button
              onClick={() => {
                if (tool.path) {
                  navigate(tool.path);
                }
              }}
            >
              {tool.action} →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureCards;