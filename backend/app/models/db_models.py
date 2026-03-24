from datetime import date, datetime

from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    progress_entries = relationship("DailyProgress", back_populates="user", cascade="all, delete-orphan")


class DailyProgress(Base):
    __tablename__ = "daily_progress"
    __table_args__ = (UniqueConstraint("user_id", "entry_date", name="uq_user_entry_date"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    entry_date = Column(Date, default=date.today, nullable=False, index=True)
    sleep_hours = Column(Float, nullable=False)
    study_hours = Column(Float, nullable=False)
    screen_time = Column(Float, nullable=False)
    stress_level = Column(Integer, nullable=False)
    mood_level = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    burnout_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="progress_entries")
