from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    phone = Column(String, nullable=False)

    password_hash = Column(String, nullable=False)

    email_verified = Column(
        Boolean,
        default=False
    )