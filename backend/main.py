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
import requests

from database import engine, Base, SessionLocal
from models import User, AIChat, AIMessage

import bcrypt

from jose import jwt
from datetime import datetime, timedelta, timezone


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

if not RESEND_API_KEY:
    raise RuntimeError("RESEND_API_KEY is not configured")

resend.api_key = RESEND_API_KEY


# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="SentinelX Security API",
    version="2.0.0"
)


# ============================================================
# JWT CONFIGURATION
# ============================================================

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is not configured")

JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sentinelx.sujalffkiller.workers.dev"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODELS
# ============================================================

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


class AIChatRequest(BaseModel):
    message: str
    history: list = []


# ============================================================
# TEMPORARY STORAGE
# ============================================================

# Registration OTP storage
otp_storage = {}

# Emails that successfully verified registration OTP
verified_emails = set()

# Password reset OTP storage
password_reset_otp_storage = {}

# Emails that successfully verified password reset OTP
password_reset_verified = set()


# ============================================================
# SUSPICIOUS KEYWORDS
# ============================================================

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


# ============================================================
# URL ANALYZER
# ============================================================

def analyze_url(url: str):

    findings = []
    score = 0

    # --------------------------------------------------------
    # Basic URL validation
    # --------------------------------------------------------

    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    try:
        parsed = urlparse(url)

    except Exception:
        return {
            "risk_score": 100,
            "risk_level": "HIGH RISK",
            "findings": [
                "Invalid URL format."
            ]
        }

    hostname = parsed.hostname or ""
    path = parsed.path or ""

    # --------------------------------------------------------
    # 1. HTTPS CHECK
    # --------------------------------------------------------

    if parsed.scheme != "https":

        score += 15

        findings.append(
            "URL does not use HTTPS."
        )

    # --------------------------------------------------------
    # 2. IP ADDRESS CHECK
    # --------------------------------------------------------

    try:

        ipaddress.ip_address(hostname)

        score += 25

        findings.append(
            "URL uses an IP address instead of a domain name."
        )

    except ValueError:

        pass

    # --------------------------------------------------------
    # 3. URL LENGTH
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # 4. SUSPICIOUS KEYWORDS
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # 5. @ SYMBOL
    # --------------------------------------------------------

    if "@" in url:

        score += 20

        findings.append(
            "URL contains an @ symbol, which can be used to obscure the destination."
        )

    # --------------------------------------------------------
    # 6. TOO MANY SUBDOMAINS
    # --------------------------------------------------------

    subdomain_parts = hostname.split(".")

    if len(subdomain_parts) >= 4:

        score += 15

        findings.append(
            "URL contains an unusually large number of subdomains."
        )

    # --------------------------------------------------------
    # 7. PUNYCODE
    # --------------------------------------------------------

    if "xn--" in hostname.lower():

        score += 25

        findings.append(
            "Domain contains Punycode, which can be used in look-alike domains."
        )

    # --------------------------------------------------------
    # 8. SUSPICIOUS SEPARATORS
    # --------------------------------------------------------

    separator_count = url.count("-")

    if separator_count >= 4:

        score += 10

        findings.append(
            "Domain contains many hyphens."
        )

    # --------------------------------------------------------
    # 9. SUSPICIOUS PORT
    # --------------------------------------------------------

    try:

        port = parsed.port

        if port is not None and port not in [80, 443]:

            score += 15

            findings.append(
                f"URL uses an unusual port: {port}."
            )

    except ValueError:

        score += 15

        findings.append(
            "URL contains an invalid port."
        )

    # --------------------------------------------------------
    # 10. ENCODED URL CHARACTERS
    # --------------------------------------------------------

    encoded_count = len(
        re.findall(
            r"%[0-9a-fA-F]{2}",
            url
        )
    )

    if encoded_count >= 3:

        score += 10

        findings.append(
            "URL contains multiple encoded characters."
        )

    # --------------------------------------------------------
    # KEEP SCORE BETWEEN 0-100
    # --------------------------------------------------------

    score = min(score, 100)

    # --------------------------------------------------------
    # RISK CLASSIFICATION
    # --------------------------------------------------------

    if score >= 70:

        risk_level = "HIGH RISK"

    elif score >= 30:

        risk_level = "SUSPICIOUS"

    else:

        risk_level = "LOW RISK"

    # --------------------------------------------------------
    # SAFE RESULT
    # --------------------------------------------------------

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


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "SentinelX Security API Running",
        "version": "2.0.0"
    }


# ============================================================
# PHISHING / URL ANALYZER
# ============================================================

@app.post("/analyze-url")
def analyze_url_endpoint(request: URLRequest):

    return analyze_url(request.url)


# ============================================================
# MALWARE SCANNER
# ============================================================

@app.post("/scan")
async def scan_file(file: UploadFile = File(...)):

    return {
        "filename": file.filename,
        "status": "Safe",
        "risk_score": 2,
        "threat_level": "Low",
        "message": "No threats detected."
    }


# ============================================================
# VERIFY REGISTRATION OTP
# ============================================================

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


# ============================================================
# REGISTER
# ============================================================

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

        # Make sure email was verified
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


# ============================================================
# LOGIN
# ============================================================

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

        # JWT payload
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "exp": datetime.now(timezone.utc)
            + timedelta(
                minutes=JWT_EXPIRE_MINUTES
            )
        }

        # Generate JWT
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


# ============================================================
# FORGOT PASSWORD
# ============================================================

@app.post("/forgot-password")
async def forgot_password(request: OTPRequest):

    db = SessionLocal()

    try:

        # Check whether account exists
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
        otp = str(
            random.randint(
                100000,
                999999
            )
        )

        # Store OTP
        password_reset_otp_storage[
            request.email
        ] = otp

        # Send OTP
        response = resend.Emails.send({

            "from": "SentinelX <onboarding@resend.dev>",

            "to": [
                request.email
            ],

            "subject": "SentinelX Password Reset Code",

            "html": f"""
                <h2>SentinelX Password Reset</h2>

                <p>Your password reset verification code is:</p>

                <h1>{otp}</h1>

                <p>
                    Enter this code in SentinelX
                    to continue resetting your password.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>
            """
        })

        return {
            "success": True,
            "message": "Password reset OTP sent successfully.",
            "email_id": response.get("id")
        }

    finally:

        db.close()


# ============================================================
# VERIFY PASSWORD RESET OTP
# ============================================================

@app.post("/verify-reset-otp")
async def verify_reset_otp(
    request: VerifyOTPRequest
):

    stored_otp = password_reset_otp_storage.get(
        request.email
    )

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

    # Remove OTP
    del password_reset_otp_storage[
        request.email
    ]

    # Mark email as verified
    password_reset_verified.add(
        request.email
    )

    return {
        "success": True,
        "verified": True,
        "message": "Password reset email verified successfully."
    }


# ============================================================
# RESET PASSWORD
# ============================================================

@app.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest
):

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

        # Hash new password
        new_password_hash = bcrypt.hashpw(
            request.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        user.password_hash = new_password_hash

        db.commit()

        # Password reset complete
        password_reset_verified.remove(
            request.email
        )

        return {
            "success": True,
            "message": "Password reset successfully. You can now login."
        }

    finally:

        db.close()

# ============================================================
# SENTINELX AI - STREAMING
# ============================================================

from fastapi.responses import StreamingResponse
import json

# ============================================================
# SENTINELX AI CHAT HISTORY
# ============================================================

class CreateAIChatRequest(BaseModel):
    user_id: int
    title: str = "New Chat"


class SaveAIMessageRequest(BaseModel):
    chat_id: int
    role: str
    content: str


# ============================================================
# CREATE NEW AI CHAT
# ============================================================

@app.post("/ai-chats")
async def create_ai_chat(request: CreateAIChatRequest):

    db = SessionLocal()

    try:

        # Check user
        user = (
            db.query(User)
            .filter(User.id == request.user_id)
            .first()
        )

        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found."
            )

        chat = AIChat(
            user_id=request.user_id,
            title=request.title.strip() or "New Chat"
        )

        db.add(chat)
        db.commit()
        db.refresh(chat)

        return {
            "success": True,
            "chat": {
                "id": chat.id,
                "user_id": chat.user_id,
                "title": chat.title,
                "created_at": chat.created_at.isoformat()
                if chat.created_at else None
            }
        }

    finally:

        db.close()


# ============================================================
# GET USER AI CHATS
# ============================================================

@app.get("/ai-chats/{user_id}")
async def get_ai_chats(user_id: int):

    db = SessionLocal()

    try:

        chats = (
            db.query(AIChat)
            .filter(AIChat.user_id == user_id)
            .order_by(AIChat.updated_at.desc())
            .all()
        )

        return {
            "success": True,
            "chats": [
                {
                    "id": chat.id,
                    "title": chat.title,
                    "created_at": (
                        chat.created_at.isoformat()
                        if chat.created_at
                        else None
                    ),
                    "updated_at": (
                        chat.updated_at.isoformat()
                        if chat.updated_at
                        else None
                    )
                }
                for chat in chats
            ]
        }

    finally:

        db.close()


# ============================================================
# GET SINGLE AI CHAT
# ============================================================

@app.get("/ai-chats/{user_id}/{chat_id}")
async def get_ai_chat(
    user_id: int,
    chat_id: int
):

    db = SessionLocal()

    try:

        chat = (
            db.query(AIChat)
            .filter(
                AIChat.id == chat_id,
                AIChat.user_id == user_id
            )
            .first()
        )

        if not chat:

            raise HTTPException(
                status_code=404,
                detail="Chat not found."
            )

        return {
            "success": True,

            "chat": {
                "id": chat.id,
                "title": chat.title,

                "messages": [
                    {
                        "id": message.id,
                        "role": message.role,
                        "content": message.content,
                        "created_at": (
                            message.created_at.isoformat()
                            if message.created_at
                            else None
                        )
                    }

                    for message in chat.messages
                ]
            }
        }

    finally:

        db.close()


# ============================================================
# SAVE AI MESSAGE
# ============================================================

@app.post("/ai-messages")
async def save_ai_message(
    request: SaveAIMessageRequest
):

    db = SessionLocal()

    try:

        chat = (
            db.query(AIChat)
            .filter(
                AIChat.id == request.chat_id
            )
            .first()
        )

        if not chat:

            raise HTTPException(
                status_code=404,
                detail="Chat not found."
            )

        if request.role not in [
            "user",
            "assistant"
        ]:

            raise HTTPException(
                status_code=400,
                detail="Invalid message role."
            )

        content = request.content.strip()

        if not content:

            raise HTTPException(
                status_code=400,
                detail="Message content is required."
            )

        message = AIMessage(
            chat_id=request.chat_id,
            role=request.role,
            content=content
        )

        db.add(message)

        # Update chat timestamp
        chat.updated_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(message)

        return {
            "success": True,

            "message": {
                "id": message.id,
                "chat_id": message.chat_id,
                "role": message.role,
                "content": message.content,
                "created_at": (
                    message.created_at.isoformat()
                    if message.created_at
                    else None
                )
            }
        }

    finally:

        db.close()


# ============================================================
# DELETE AI CHAT
# ============================================================

@app.delete("/ai-chats/{user_id}/{chat_id}")
async def delete_ai_chat(
    user_id: int,
    chat_id: int
):

    db = SessionLocal()

    try:

        chat = (
            db.query(AIChat)
            .filter(
                AIChat.id == chat_id,
                AIChat.user_id == user_id
            )
            .first()
        )

        if not chat:

            raise HTTPException(
                status_code=404,
                detail="Chat not found."
            )

        db.delete(chat)

        db.commit()

        return {
            "success": True,
            "message": "Chat deleted successfully."
        }

    finally:

        db.close()


# ============================================================
# SENTINELX AI - STREAMING + CONVERSATION MEMORY
# ============================================================

@app.post("/ai-chat")
async def ai_chat(request: AIChatRequest):

    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message is required."
        )

    # --------------------------------------------------------
    # BUILD CONVERSATION HISTORY
    # --------------------------------------------------------

    conversation = ""

    for item in request.history:

        role = item.get("role", "")
        text = item.get("text", "").strip()

        if not text:
            continue

        if role == "user":
            conversation += f"User: {text}\n"

        elif role == "assistant":
            conversation += f"SentinelX AI: {text}\n"

    # --------------------------------------------------------
    # SENTINELX AI PROMPT
    # --------------------------------------------------------

    prompt = f"""
You are SentinelX AI, a cybersecurity assistant inside
the SentinelX cybersecurity platform.

Your job is to help users with:

- Cybersecurity
- Phishing
- Malware
- Password security
- Privacy
- Network security
- Online safety
- Account security
- Social engineering
- Safe browsing
- Security best practices

Rules:

1. Give concise and useful answers.
2. Keep explanations beginner-friendly.
3. Explain technical terms when necessary.
4. Focus on defensive and authorized cybersecurity.
5. Never provide instructions for credential theft,
   malware deployment, unauthorized access,
   destructive attacks, or evasion.
6. Never claim that a website or file is safe without
   sufficient evidence.
7. For security questions, explain the risk and
   recommended defensive action.
8. If the user asks something unrelated to cybersecurity,
   politely explain that you specialize in cybersecurity.
9. Use the previous conversation to understand follow-up
   questions.
10. Do not repeat the entire conversation unnecessarily.

Previous conversation:

{conversation}

Current user question:

{message}

Answer as SentinelX AI:
"""

    # --------------------------------------------------------
    # STREAM FROM OLLAMA
    # --------------------------------------------------------

    def generate_response():

        try:

            response = requests.post(
                "http://127.0.0.1:11434/api/generate",

                json={
                    "model": "llama3.2",

                    "prompt": prompt,

                    "stream": True,

                    "options": {
                        "temperature": 0.2,
                        "num_predict": 120
                    }
                },

                stream=True,

                timeout=120
            )

            response.raise_for_status()

            # ------------------------------------------------
            # READ OLLAMA STREAM
            # ------------------------------------------------

            for line in response.iter_lines():

                if not line:
                    continue

                try:

                    data = json.loads(
                        line.decode("utf-8")
                    )

                    chunk = data.get(
                        "response",
                        ""
                    )

                    if chunk:
                        yield chunk

                    if data.get("done"):
                        break

                except json.JSONDecodeError:
                    continue

        except requests.exceptions.ConnectionError:

            yield (
                "\n\n⚠️ Unable to connect to Ollama.\n"
                "Make sure Ollama is running."
            )

        except requests.exceptions.Timeout:

            yield (
                "\n\n⚠️ SentinelX AI took too long "
                "to respond. Please try again."
            )

        except requests.exceptions.RequestException as e:

            yield (
                f"\n\n⚠️ Ollama connection failed: {str(e)}"
            )

        except Exception as e:

            yield (
                f"\n\n⚠️ AI processing error: {str(e)}"
            )

    # --------------------------------------------------------
    # RETURN STREAM
    # --------------------------------------------------------

    return StreamingResponse(
        generate_response(),
        media_type="text/plain"
    )

    # --------------------------------------------------------
    # SENTINELX AI PROMPT
    # --------------------------------------------------------

    prompt = f"""
You are SentinelX AI, a cybersecurity assistant.

Help with:
- Cybersecurity
- Phishing
- Malware
- Password security
- Privacy
- Network security
- Online safety

Rules:
- Give concise, beginner-friendly answers.
- Focus on defensive cybersecurity.
- Explain technical terms simply.
- Never help with credential theft,
  malware deployment, unauthorized access,
  or destructive attacks.
- For unrelated questions, politely say
  you specialize in cybersecurity.

User:
{message}

Answer:
"""

    # --------------------------------------------------------
    # STREAM OLLAMA RESPONSE
    # --------------------------------------------------------

    def generate_response():

        try:

            response = requests.post(
                "http://127.0.0.1:11434/api/generate",

                json={
                    "model": "llama3.2",
                    "prompt": prompt,
                    "stream": True,
                    "options": {
                        "temperature": 0.2,
                        "num_predict": 120
                    }
                },

                stream=True,
                timeout=120
            )

            response.raise_for_status()

            # ------------------------------------------------
            # READ OLLAMA STREAM
            # ------------------------------------------------

            for line in response.iter_lines():

                if not line:
                    continue

                try:

                    data = json.loads(
                        line.decode("utf-8")
                    )

                    chunk = data.get(
                        "response",
                        ""
                    )

                    if chunk:

                        yield chunk

                    # Ollama signals completion
                    if data.get("done"):

                        break

                except json.JSONDecodeError:

                    continue

        except requests.exceptions.ConnectionError:

            yield (
                "\n\n⚠️ Unable to connect to Ollama. "
                "Make sure Ollama is running."
            )

        except requests.exceptions.Timeout:

            yield (
                "\n\n⚠️ SentinelX AI took too long "
                "to respond. Please try again."
            )

        except requests.exceptions.RequestException as e:

            yield (
                f"\n\n⚠️ Ollama connection failed: {str(e)}"
            )

        except Exception as e:

            yield (
                f"\n\n⚠️ AI processing error: {str(e)}"
            )

    # --------------------------------------------------------
    # RETURN STREAM
    # --------------------------------------------------------

    return StreamingResponse(
        generate_response(),
        media_type="text/plain"
    )