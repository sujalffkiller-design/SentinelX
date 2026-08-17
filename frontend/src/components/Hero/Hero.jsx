import "./Hero.css";
import { ShieldCheck, ScanSearch, Link2, LockKeyhole } from "lucide-react";

function Hero() {
  return (
    <section className="hero">

      {/* Background glow */}
      <div className="heroGlow heroGlowOne"></div>
      <div className="heroGlow heroGlowTwo"></div>

      {/* Left Content */}
      <div className="heroContent">

        <div className="heroBadge">
          <span className="badgeDot"></span>
          AI-POWERED CYBERSECURITY PLATFORM
        </div>

        <h1>
          Your AI-Powered
          <span> Cybersecurity Shield</span>
        </h1>

        <p className="heroDescription">
          Detect, analyze, and respond to cyber threats in real-time.
          One intelligent platform to protect your digital world.
        </p>


        <div className="heroTrust">

          <div>
            <ShieldCheck size={20} />
            <span>AI Powered</span>
          </div>

          <div>
            <ScanSearch size={20} />
            <span>Real-time Protection</span>
          </div>

          <div>
            <LockKeyhole size={20} />
            <span>Secure & Private</span>
          </div>

        </div>

      </div>

      {/* Right Visual */}
      <div className="heroVisual">

        <div className="cyberGrid"></div>

        <div className="shieldContainer">

          <div className="shieldOuter">
            <ShieldCheck size={170} strokeWidth={1.2} />
            <span className="shieldX">X</span>
          </div>

          <div className="scanRing ringOne"></div>
          <div className="scanRing ringTwo"></div>
          <div className="scanRing ringThree"></div>

        </div>

        {/* Floating cards */}

        <div className="securityCard malwareCard">
          <ShieldCheck size={20} />
          <div>
            <strong>Malware Scan</strong>
            <small>✓ No threats found</small>
          </div>
        </div>

        <div className="securityCard phishingCard">
          <Link2 size={20} />
          <div>
            <strong>Phishing Detect</strong>
            <small>✓ Safe</small>
          </div>
        </div>

        <div className="securityCard passwordCard">
          <LockKeyhole size={20} />
          <div>
            <strong>Password Check</strong>
            <small>✓ Strong</small>
          </div>
        </div>

        <div className="securityCard urlCard">
          <ScanSearch size={20} />
          <div>
            <strong>URL Scanner</strong>
            <small>✓ Safe</small>
          </div>
        </div>

      </div>

    </section>
  );
}

export default Hero;