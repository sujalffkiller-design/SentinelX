import {
  ShieldCheck,
  Target,
  Eye,
  Cpu,
  LockKeyhole,
  Rocket,
} from "lucide-react";

import "./About.css";

function About() {
  return (
    <main className="about-page">

      <section className="about-hero">
        <p className="about-label">ABOUT SENTINELX</p>

        <h1>
          Security Built for the
          <span> Digital World.</span>
        </h1>

        <p className="about-intro">
          SentinelX is a cybersecurity platform designed to bring
          essential security tools, threat analysis, and security
          insights together in one place.
        </p>
      </section>

      <section className="about-story">

        <div className="about-story-content">
          <p className="about-label">OUR PURPOSE</p>

          <h2>Making Cybersecurity Easier to Understand</h2>

          <p>
            Cybersecurity can feel complicated. SentinelX is designed
            to make important security checks easier to access and
            easier to understand.
          </p>

          <p>
            From detecting suspicious links to analyzing files and
            checking password strength, SentinelX brings practical
            security capabilities into a single platform.
          </p>
        </div>

        <div className="about-shield">
          <ShieldCheck size={100} />
          <span>SentinelX</span>
        </div>

      </section>

      <section className="about-values">

        <div className="about-section-heading">
          <p className="about-label">WHAT DRIVES US</p>
          <h2>Our Core Principles</h2>
        </div>

        <div className="about-values-grid">

          <article className="about-card">
            <div className="about-icon">
              <Target size={28} />
            </div>
            <h3>Our Mission</h3>
            <p>
              Make useful cybersecurity tools accessible and
              understandable for everyone.
            </p>
          </article>

          <article className="about-card">
            <div className="about-icon">
              <Eye size={28} />
            </div>
            <h3>Our Vision</h3>
            <p>
              Build a smarter security platform that helps people
              identify and understand digital threats.
            </p>
          </article>

          <article className="about-card">
            <div className="about-icon">
              <LockKeyhole size={28} />
            </div>
            <h3>Security First</h3>
            <p>
              Security and privacy remain at the center of the
              SentinelX experience.
            </p>
          </article>

          <article className="about-card">
            <div className="about-icon">
              <Cpu size={28} />
            </div>
            <h3>Technology</h3>
            <p>
              We combine modern web technologies, security analysis,
              APIs, and AI capabilities to build SentinelX.
            </p>
          </article>

        </div>

      </section>

      <section className="about-platform">

        <div>
          <p className="about-label">THE PLATFORM</p>

          <h2>One Platform. Multiple Layers of Protection.</h2>

          <p>
            SentinelX brings together security scanning, threat
            detection, password analysis, monitoring, reporting, and
            intelligent assistance.
          </p>
        </div>

        <div className="about-platform-features">
          <div>
            <ShieldCheck size={22} />
            <span>Threat Detection</span>
          </div>

          <div>
            <LockKeyhole size={22} />
            <span>Password Security</span>
          </div>

          <div>
            <Cpu size={22} />
            <span>AI Assistance</span>
          </div>

          <div>
            <Rocket size={22} />
            <span>Continuous Improvement</span>
          </div>
        </div>

      </section>

      <section className="about-footer">

        <p className="about-label">SENTINELX</p>

        <h2>Detect. Analyze. Protect.</h2>

        <p>
          Building a safer digital future, one security layer at a time.
        </p>

      </section>

    </main>
  );
}

export default About;