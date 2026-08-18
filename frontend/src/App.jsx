import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

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
import ForgotPassword from "./pages/ForgotPassword";

import ProfilePage from "./pages/ProfilePage";
import AccountSettings from "./pages/AccountSettings";

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

  /* =================================
     LOAD SAVED THEME
  ================================= */

  useEffect(() => {

    const savedSettings =
      localStorage.getItem("sentinelx_settings");

    if (savedSettings) {

      try {

        const settings =
          JSON.parse(savedSettings);

        if (settings.darkMode === false) {

          document.body.classList.add("light-mode");

        } else {

          document.body.classList.remove("light-mode");

        }

      } catch (error) {

        console.error(
          "Failed to load SentinelX settings:",
          error
        );

      }

    }

  }, []);


  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            HOME
        ========================= */}

        <Route
          path="/"
          element={<LandingPage />}
        />


        {/* =========================
            FEATURES
        ========================= */}

        <Route
          path="/features"
          element={
            <PageWithNavbar>
              <Features />
            </PageWithNavbar>
          }
        />


        {/* =========================
            TOOLS
        ========================= */}

        <Route
          path="/tools"
          element={
            <PageWithNavbar>
              <Tools />
            </PageWithNavbar>
          }
        />


        {/* =========================
            DASHBOARD
        ========================= */}

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


        {/* =========================
            ABOUT
        ========================= */}

        <Route
          path="/about"
          element={
            <PageWithNavbar>
              <About />
            </PageWithNavbar>
          }
        />


        {/* =========================
            AUTH
        ========================= */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* =========================
            SCAN HISTORY
        ========================= */}

        <Route
          path="/scan-history"
          element={<ScanHistory />}
        />


        {/* =========================
            SECURITY TOOLS
        ========================= */}

        <Route
          path="/phishing"
          element={<PhishingDetector />}
        />

        <Route
          path="/malware"
          element={<MalwareScanner />}
        />

        <Route
          path="/password"
          element={<PasswordAuditor />}
        />


        {/* =========================
            PROFILE
        ========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>

              <PageWithNavbar>
                <ProfilePage />
              </PageWithNavbar>

            </ProtectedRoute>
          }
        />


        {/* =========================
            SETTINGS
        ========================= */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>

              <PageWithNavbar>
                <AccountSettings />
              </PageWithNavbar>

            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;