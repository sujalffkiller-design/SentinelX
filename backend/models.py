from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from database import Base


# ============================================================
# USER
# ============================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    phone = Column(
        String,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    email_verified = Column(
        Boolean,
        default=False
    )

    # --------------------------------------------------------
    # AI CHAT RELATIONSHIP
    # --------------------------------------------------------

    ai_chats = relationship(
        "AIChat",
        back_populates="user",
        cascade="all, delete-orphan"
    )


# ============================================================
# AI CHAT
# ============================================================

class AIChat(Base):

    __tablename__ = "ai_chats"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    title = Column(
        String,
        nullable=False,
        default="New Chat"
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # --------------------------------------------------------
    # RELATIONSHIPS
    # --------------------------------------------------------

    user = relationship(
        "User",
        back_populates="ai_chats"
    )

    messages = relationship(
        "AIMessage",
        back_populates="chat",
        cascade="all, delete-orphan",
        order_by="AIMessage.created_at"
    )


# ============================================================
# AI MESSAGE
# ============================================================

class AIMessage(Base):

    __tablename__ = "ai_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    chat_id = Column(
        Integer,
        ForeignKey("ai_chats.id"),
        nullable=False,
        index=True
    )

    role = Column(
        String,
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    # --------------------------------------------------------
    # RELATIONSHIP
    # --------------------------------------------------------

    chat = relationship(
        "AIChat",
        back_populates="messages"
    )