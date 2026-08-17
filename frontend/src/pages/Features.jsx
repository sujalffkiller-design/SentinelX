import {
  ShieldCheck,
  Fish,
  LockKeyhole,
  FileSearch,
  BarChart3,
  BrainCircuit,
} from "lucide-react";

import "./Features.css";

const features = [
  {
    icon: ShieldCheck,
    title: "Malware Detection",
    description:
      "Analyze uploaded files and identify malware, ransomware, suspicious content, and potential security threats.",
  },
  {
    icon: Fish,
    title: "Phishing Detection",
    description:
      "Analyze suspicious links and websites to identify phishing attempts and other deceptive online threats.",
  },
  {
    icon: LockKeyhole,
    title: "Password Security",
    description:
      "Evaluate password strength and identify weak patterns that could make accounts easier to compromise.",
  },
  {
    icon: FileSearch,
    title: "Security Scanning",
    description:
      "Run security checks and turn scan results into clear threat and risk information.",
  },
  {
    icon: BarChart3,
    title: "Security Dashboard",
    description:
      "Monitor security activity, scan results, threat levels, and important security statistics from one place.",
  },
  {
    icon: BrainCircuit,
    title: "AI Cyber Assistant",
    description:
      "Get cybersecurity guidance and explanations through an AI-powered security assistant.",
  },
];

function Features() {
  return (
    <main className="features-page">

      <section className="features-hero">
        <p className="features-label">SENTINELX SECURITY PLATFORM</p>

        <h1>
          Powerful Security.
          <span> One Platform.</span>
        </h1>

        <p className="features-intro">
          SentinelX brings multiple cybersecurity capabilities together
          to help you detect threats, analyze risks, and understand your
          security posture.
        </p>
      </section>

      <section className="features-grid-section">

        <div className="features-section-heading">
          <p>WHAT SENTINELX OFFERS</p>
          <h2>Security Features</h2>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article className="feature-detail-card" key={index}>

                <div className="feature-detail-icon">
                  <Icon size={30} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

              </article>
            );
          })}
        </div>

      </section>

      <section className="features-bottom">

        <p className="features-label">BUILT FOR SECURITY</p>

        <h2>
          Detect. Analyze. Protect.
        </h2>

        <p>
          SentinelX is designed to make cybersecurity tools easier to
          access and easier to understand from a single platform.
        </p>

      </section>

    </main>
  );
}

export default Features;