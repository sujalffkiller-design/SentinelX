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
    path: "/url-scanner",
  },

  {
    icon: BarChart3,
    title: "Security Dashboard",
    desc: "Monitor scans, reports, and your security activity.",
    action: "View Dashboard",
    path: "/dashboard",
  },

  {
    icon: Bot,
    title: "AI Cyber Assistant",
    desc: "Ask cybersecurity questions and get AI-powered answers.",
    action: "Chat with AI",
    path: "/ai-assistant",
  },
];


function FeatureCards() {

  const navigate = useNavigate();


  return (
    <section className="featuresSection">

      {/* =========================
          SECTION HEADING
      ========================= */}

      <h2>
        Powerful Tools for <span>Complete Protection</span>
      </h2>


      {/* =========================
          TOOL GRID
      ========================= */}

      <div className="featureGrid">

        {tools.map((tool, index) => {

          const Icon = tool.icon;

          return (
            <div
              className="featureCard"
              key={index}
            >

              {/* ICON */}

              <Icon
                size={34}
                className="featureIcon"
              />


              {/* TITLE */}

              <h3>
                {tool.title}
              </h3>


              {/* DESCRIPTION */}

              <p>
                {tool.desc}
              </p>


              {/* ACTION BUTTON */}

              <button
                onClick={() => navigate(tool.path)}
              >
                {tool.action} →
              </button>

            </div>
          );

        })}

      </div>

    </section>
  );
}


export default FeatureCards;