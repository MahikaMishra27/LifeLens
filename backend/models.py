
from sqlalchemy import Column, Integer, String, Float, Date, Text, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()



class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    date = Column(Date, nullable=False)
    payment_method = Column(String(50))
    notes = Column(Text)


class Income(Base):
    __tablename__ = "income"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    date = Column(Date, nullable=False)
    payment_method = Column(String(50))
    notes = Column(Text)

class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(Text)
    created_at = Column(Date, nullable=False)

class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, nullable=False)
    completed_date = Column(Date, nullable=False)
    is_completed = Column(Boolean, default=True)

class FocusSession(Base):
    __tablename__ = "focus_sessions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    session_date = Column(Date, nullable=False)
    is_completed = Column(Boolean, default=True)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True, index=True)
    avatar_url = Column(Text, nullable=True)
    created_at = Column(Date, nullable=False)

