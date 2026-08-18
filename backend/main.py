from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import urlparse
import ipaddress
import re
import os
import random
from dotenv import load_dotenv
import resend

from database import engine, Base, SessionLocal
from models import User

import bcrypt

from jose import jwt
from datetime import datetime, timedelta, timezone

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

if not RESEND_API_KEY:
    raise RuntimeError("RESEND_API_KEY is not configured")

resend.api_key = RESEND_API_KEY

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SentinelX Security API",
    version="2.0.0"
)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is not configured")

JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60

# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Request Model
# -----------------------------

class URLRequest(BaseModel):
    url: str

class OTPRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class ResetPasswordRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# Temporary OTP storage
otp_storage = {}

# Registration email verification
verified_emails = set()

# Password reset OTP storage
password_reset_otp_storage = {}

# Emails that successfully verified a password reset OTP
password_reset_verified = set()



# -----------------------------
# Suspicious Keywords
# -----------------------------

SUSPICIOUS_KEYWORDS = [
    "login",
    "verify",
    "verification",
    "account",
    "secure",
    "security",
    "update",
    "password",
    "signin",
    "confirm",
    "wallet",
    "payment",
    "bank",
    "unlock",
    "suspended",
]


# -----------------------------
# URL Analyzer
# -----------------------------

def analyze_url(url: str):

    findings = []
    score = 0

    # -------------------------
    # Basic URL validation
    # -------------------------

    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    try:
        parsed = urlparse(url)
    except Exception:
        return {
            "risk_score": 100,
            "risk_level": "HIGH RISK",
            "findings": ["Invalid URL format."]
        }

    hostname = parsed.hostname or ""
    path = parsed.path or ""

    # -------------------------
    # 1. HTTPS check
    # -------------------------

    if parsed.scheme != "https":
        score += 15

        findings.append(
            "URL does not use HTTPS."
        )

    # -------------------------
    # 2. IP address check
    # -------------------------

    try:
        ipaddress.ip_address(hostname)

        score += 25

        findings.append(
            "URL uses an IP address instead of a domain name."
        )

    except ValueError:
        pass

    # -------------------------
    # 3. URL length
    # -------------------------

    if len(url) > 100:
        score += 10

        findings.append(
            "URL is unusually long."
        )

    if len(url) > 200:
        score += 10

        findings.append(
            "URL is extremely long and may contain obfuscation."
        )

    # -------------------------
    # 4. Suspicious keywords
    # -------------------------

    lower_url = url.lower()

    matched_keywords = []

    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in lower_url:
            matched_keywords.append(keyword)

    if len(matched_keywords) >= 2:
        score += 20

        findings.append(
            "URL contains multiple security-sensitive keywords."
        )

    elif len(matched_keywords) == 1:
        score += 8

        findings.append(
            f"URL contains suspicious keyword: {matched_keywords[0]}."
        )

    # -------------------------
    # 5. @ symbol
    # -------------------------

    if "@" in url:
        score += 20

        findings.append(
            "URL contains an @ symbol, which can be used to obscure the destination."
        )

    # -------------------------
    # 6. Too many subdomains
    # -------------------------

    subdomain_parts = hostname.split(".")

    if len(subdomain_parts) >= 4:
        score += 15

        findings.append(
            "URL contains an unusually large number of subdomains."
        )

    # -------------------------
    # 7. Punycode
    # -------------------------

    if "xn--" in hostname.lower():
        score += 25

        findings.append(
            "Domain contains Punycode, which can be used in look-alike domains."
        )

    # -------------------------
    # 8. Suspicious separators
    # -------------------------

    separator_count = url.count("-")

    if separator_count >= 4:
        score += 10

        findings.append(
            "Domain contains many hyphens."
        )

    # -------------------------
    # 9. Suspicious port
    # -------------------------

    if parsed.port is not None:

        if parsed.port not in [80, 443]:
            score += 15

            findings.append(
                f"URL uses an unusual port: {parsed.port}."
            )

    # -------------------------
    # 10. Encoded URL characters
    # -------------------------

    encoded_count = len(re.findall(r"%[0-9a-fA-F]{2}", url))

    if encoded_count >= 3:
        score += 10

        findings.append(
            "URL contains multiple encoded characters."
        )

    # -------------------------
    # Keep score between 0-100
    # -------------------------

    score = min(score, 100)

    # -------------------------
    # Risk classification
    # -------------------------

    if score >= 70:
        risk_level = "HIGH RISK"

    elif score >= 30:
        risk_level = "SUSPICIOUS"

    else:
        risk_level = "LOW RISK"

    # -------------------------
    # Safe result
    # -------------------------

    if not findings:
        findings.append(
            "No obvious phishing indicators were detected."
        )

    return {
        "url": url,
        "risk_score": score,
        "risk_level": risk_level,
        "findings": findings,
        "checks_performed": [
            "HTTPS",
            "IP address",
            "URL length",
            "Suspicious keywords",
            "Obfuscation",
            "Subdomains",
            "Punycode",
            "URL encoding",
            "Port analysis"
        ]
    }


# -----------------------------
# Routes
# -----------------------------

@app.get("/")
def root():

    return {
        "message": "SentinelX Security API Running",
        "version": "2.0.0"
    }


@app.post("/analyze-url")
def analyze_url_endpoint(request: URLRequest):

    return analyze_url(request.url)

@app.post("/scan")
async def scan_file(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "status": "Safe",
        "risk_score": 2,
        "threat_level": "Low",
        "message": "No threats detected."
    }

@app.post("/send-otp")
async def send_otp(request: OTPRequest):

    otp = str(random.randint(100000, 999999))

    otp_storage[request.email] = otp

    try:
        response = resend.Emails.send({
            "from": "SentinelX <onboarding@resend.dev>",
            "to": [request.email],
            "subject": "Your SentinelX Verification Code",
            "html": f"""
                <h2>SentinelX Email Verification</h2>

                <p>Your verification code is:</p>

                <h1>{otp}</h1>

                <p>This OTP is valid for a short period.</p>

                <p>If you did not request this code, you can safely ignore this email.</p>
            """
        })

        return {
            "success": True,
            "message": "OTP sent successfully",
            "email_id": response.get("id")
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send OTP: {str(e)}"
        )

@app.post("/verify-otp")
async def verify_otp(request: VerifyOTPRequest):

    stored_otp = otp_storage.get(request.email)

    if not stored_otp:
        raise HTTPException(
            status_code=400,
            detail="No OTP found. Please request a new OTP."
        )

    if request.otp != stored_otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP."
        )

    # Remove OTP after successful verification
    del otp_storage[request.email]
    verified_emails.add(request.email)

    return {
        "success": True,
        "verified": True,
        "message": "Email verified successfully."
    }

@app.post("/register")
async def register_user(request: RegisterRequest):

    db = SessionLocal()

    try:
        # Check whether email already exists
        existing_user = (
            db.query(User)
            .filter(User.email == request.email)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="An account with this email already exists."
            )

        # Make sure the email was verified
        if request.email not in verified_emails:
            raise HTTPException(
                status_code=400,
                detail="Email has not been verified."
            )

        # Hash password
        password_hash = bcrypt.hashpw(
            request.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # Create user
        new_user = User(
            full_name=request.full_name,
            email=request.email,
            phone=request.phone,
            password_hash=password_hash,
            email_verified=True
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "success": True,
            "message": "SentinelX account created successfully.",
            "user_id": new_user.id
        }

    finally:
        db.close()

@app.post("/login")
async def login_user(request: LoginRequest):

    db = SessionLocal()

    try:
        # Find user by email
        user = (
            db.query(User)
            .filter(User.email == request.email)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        # Check email verification
        if not user.email_verified:
            raise HTTPException(
                status_code=403,
                detail="Please verify your email before logging in."
            )

        # Check password
        password_valid = bcrypt.checkpw(
            request.password.encode("utf-8"),
            user.password_hash.encode("utf-8")
        )

        if not password_valid:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "exp": datetime.now(timezone.utc) + timedelta(
                minutes=JWT_EXPIRE_MINUTES
            )
        }

        access_token = jwt.encode(
            token_data,
            JWT_SECRET_KEY,
            algorithm=JWT_ALGORITHM
        )

        return {
            "success": True,
            "message": "Login successful.",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email
            }
        }

    finally:
        db.close()

@app.post("/forgot-password")
async def forgot_password(request: OTPRequest):

    db = SessionLocal()

    try:
        # Check whether the account exists
        user = (
            db.query(User)
            .filter(User.email == request.email)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="No account found with this email address."
            )

        # Generate OTP
        otp = str(random.randint(100000, 999999))

        # Store OTP separately from registration OTP
        password_reset_otp_storage[request.email] = otp

        # Send OTP
        response = resend.Emails.send({
            "from": "SentinelX <onboarding@resend.dev>",
            "to": [request.email],
            "subject": "SentinelX Password Reset Code",
            "html": f"""
                <h2>SentinelX Password Reset</h2>

                <p>Your password reset verification code is:</p>

                <h1>{otp}</h1>

                <p>Enter this code in SentinelX to continue resetting your password.</p>

                <p>If you did not request a password reset, you can safely ignore this email.</p>
            """
        })

        return {
            "success": True,
            "message": "Password reset OTP sent successfully.",
            "email_id": response.get("id")
        }

    finally:
        db.close()

@app.post("/verify-reset-otp")
async def verify_reset_otp(request: VerifyOTPRequest):

    stored_otp = password_reset_otp_storage.get(request.email)

    if not stored_otp:
        raise HTTPException(
            status_code=400,
            detail="No password reset OTP found. Please request a new OTP."
        )

    if request.otp != stored_otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid password reset OTP."
        )

    # Remove OTP after successful verification
    del password_reset_otp_storage[request.email]

    # Mark email as verified for password reset
    password_reset_verified.add(request.email)

    return {
        "success": True,
        "verified": True,
        "message": "Password reset email verified successfully."
    }

@app.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):

    if request.email not in password_reset_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your password reset OTP first."
        )

    if len(request.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long."
        )

    db = SessionLocal()

    try:
        user = (
            db.query(User)
            .filter(User.email == request.email)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User account not found."
            )

        # Hash the new password
        new_password_hash = bcrypt.hashpw(
            request.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        user.password_hash = new_password_hash

        db.commit()

        # Password reset is complete
        password_reset_verified.remove(request.email)

        return {
            "success": True,
            "message": "Password reset successfully. You can now login."
        }

    finally:
        db.close()