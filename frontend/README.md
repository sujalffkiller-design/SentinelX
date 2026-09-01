# 🛡️ SentinelX

### AI-Powered Cybersecurity Platform

SentinelX is a modern cybersecurity platform designed to help users detect common online security threats through a collection of security tools and an intelligent cybersecurity assistant.

The project combines a React frontend with a FastAPI backend to provide a centralized security experience.

---

## 🚀 Features

### 🎣 Phishing Detector
Analyze URLs and identify common phishing indicators such as:

- Suspicious keywords
- Missing HTTPS
- IP-based URLs
- URL obfuscation
- Suspicious domains
- Excessive subdomains
- Punycode domains
- Unusual ports

---

### 🦠 Malware Scanner
Upload a file and perform a security scan through the SentinelX malware scanning system.

Features include:

- File scanning
- Threat status
- Risk score
- Threat level
- Scan results

---

### 🔑 Password Auditor
Evaluate password security and identify potential password weaknesses.

---

### 🔍 URL Scanner
Analyze websites for common security indicators.

The scanner evaluates:

- HTTPS
- IP addresses
- URL length
- Suspicious keywords
- Obfuscation
- Subdomains
- Punycode
- URL encoding
- Port analysis

---

### 📊 Security Dashboard

The SentinelX dashboard provides a centralized security overview.

It displays:

- Security Score
- Threats Detected
- Suspicious Threats
- Overall Risk Level
- Recent Security Activity
- Quick Actions

---

### 📜 Scan History

SentinelX keeps track of security scan results so users can review their previous activity.

---

### 👤 User Authentication

SentinelX includes:

- User registration
- Email verification
- OTP authentication
- Login
- JWT authentication
- Forgot password
- Password reset
- Profile management
- Account settings

---

### 🤖 SentinelX AI

SentinelX includes an AI cybersecurity assistant designed to help users understand cybersecurity concepts and security results.

The goal is to provide an experience similar to an AI chat assistant while keeping the system focused specifically on cybersecurity.

---

## 🏗️ Project Architecture

```text
SentinelX
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── MalwareScanner/
│   │   │   ├── PasswordAuditor/
│   │   │   ├── PhishingDetector/
│   │   │   ├── ScanHistory/
│   │   │   └── URLScanner/
│   │   │
│   │   ├── pages/
│   │   └── styles/
│   │
│   └── package.json
│
├── backend/
│   │
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── .env
│   └── ...
│
├── .gitignore
└── README.md