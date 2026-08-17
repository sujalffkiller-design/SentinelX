import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import FeatureCards from "./components/FeatureCards/FeatureCards";
import ThreatMonitor from "./components/ThreatMonitor/ThreatMonitor";
import SecurityFlow from "./components/SecurityFlow/SecurityFlow";

import PhishingDetector from "./components/PhishingDetector/PhishingDetector";
import MalwareScanner from "./components/MalwareScanner/MalwareScanner";
import PasswordAuditor from "./components/PasswordAuditor/PasswordAuditor";

import Dashboard from "./components/Dashboard/Dashboard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ScanHistory from "./components/ScanHistory/ScanHistory";

import ProtectedRoute from "./components/Auth/ProtectedRoute";

import Tools from "./pages/Tools";
import Features from "./pages/Features";
import About from "./pages/About";

import "./styles/globals.css";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeatureCards />
      <ThreatMonitor />
      <SecurityFlow />
    </>
  );
}

function PageWithNavbar({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<LandingPage />} />

        {/* MAIN NAVBAR PAGES */}
        <Route
          path="/features"
          element={
            <PageWithNavbar>
              <Features />
            </PageWithNavbar>
          }
        />

        <Route
          path="/tools"
          element={
            <PageWithNavbar>
              <Tools />
            </PageWithNavbar>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWithNavbar>
                <Dashboard />
              </PageWithNavbar>
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <PageWithNavbar>
              <About />
            </PageWithNavbar>
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* OTHER PAGES */}
        <Route path="/scan-history" element={<ScanHistory />} />

        {/* SECURITY TOOLS */}
        <Route path="/phishing" element={<PhishingDetector />} />
        <Route path="/malware" element={<MalwareScanner />} />
        <Route path="/password" element={<PasswordAuditor />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
