import os
from dotenv import load_dotenv
from google import genai
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from datetime import date
import time

from database import engine
from models import Expense, Income, Habit, HabitLog, FocusSession, Profile, Base

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options={"timeout": 60000}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(title="LifeLens API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5178",
        "http://127.0.0.1:5178",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: date
    payment_method: str | None = None
    notes: str | None = None

class IncomeCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: date
    payment_method: str | None = None
    notes: str | None = None

class HabitCreate(BaseModel):
    name: str
    category: str
    description: str | None = None
    created_at: date

class HabitLogCreate(BaseModel):
    habit_id: int
    completed_date: date
    is_completed: bool = True

class FocusSessionCreate(BaseModel):
    title: str
    duration_minutes: int
    session_date: date
    is_completed: bool = True

class ProfileCreate(BaseModel):
    full_name: str
    email: str
    avatar_url: str | None = None
@app.post("/profile")
def create_profile(profile: ProfileCreate):
    db = SessionLocal()

    try:
        existing_profile = db.query(Profile).filter(
            Profile.email == profile.email
        ).first()

        if existing_profile:
            raise HTTPException(
                status_code=409,
                detail="Profile with this email already exists"
            )

        new_profile = Profile(
            full_name=profile.full_name,
            email=profile.email,
            avatar_url=profile.avatar_url,
            created_at=date.today()
        )

        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)

        return {
            "message": "Profile created successfully",
            "id": new_profile.id,
            "full_name": new_profile.full_name,
            "email": new_profile.email,
            "avatar_url": new_profile.avatar_url
        }

    finally:
        db.close()


@app.get("/profile")
def get_profile(email: str):
    db = SessionLocal()

    try:
        profile = db.query(Profile).filter(
            Profile.email == email
        ).first()

        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found"
            )

        return {
            "id": profile.id,
            "full_name": profile.full_name,
            "email": profile.email,
            "avatar_url": profile.avatar_url
        }

    finally:
        db.close()
@app.put("/profile/{profile_id}")
def update_profile(profile_id: int, profile: ProfileCreate):
    db = SessionLocal()

    try:
        existing_profile = db.query(Profile).filter(
            Profile.id == profile_id
        ).first()

        if not existing_profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found"
            )

        email_exists = db.query(Profile).filter(
            Profile.email == profile.email,
            Profile.id != profile_id
        ).first()

        if email_exists:
            raise HTTPException(
                status_code=409,
                detail="This email is already in use"
            )

        existing_profile.full_name = profile.full_name
        existing_profile.email = profile.email
        existing_profile.avatar_url = profile.avatar_url

        db.commit()
        db.refresh(existing_profile)

        return {
            "message": "Profile updated successfully",
            "id": existing_profile.id,
            "full_name": existing_profile.full_name,
            "email": existing_profile.email,
            "avatar_url": existing_profile.avatar_url
        }

    finally:
        db.close()

@app.get("/")
def home():
    return {
        "message": "Welcome to LifeLens API"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "project": "LifeLens"
    }

@app.get("/db-check")
def check_database():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "project": "LifeLens"
        }

    except Exception as error:
        return {
            "database": "disconnected",
            "error": str(error)
        }

@app.post("/expenses")
def add_expense(expense: ExpenseCreate):

    db = SessionLocal()

    try:
        new_expense = Expense(
            title=expense.title,
            amount=expense.amount,
            category=expense.category,
            date=expense.date,
            payment_method=expense.payment_method,
            notes=expense.notes
        )

        db.add(new_expense)
        db.commit()
        db.refresh(new_expense)

        return {
            "message": "Expense added successfully",
            "expense_id": new_expense.id
        }

    finally:
        db.close()

@app.get("/expenses")
def get_expenses():

    db = SessionLocal()

    try:
        expenses = db.query(Expense).all()

        return expenses

    finally:
        db.close()

@app.put("/expenses/{expense_id}")
def update_expense(expense_id: int, expense: ExpenseCreate):

    db = SessionLocal()

    try:
        existing_expense = db.query(Expense).filter(
            Expense.id == expense_id
        ).first()

        if not existing_expense:
            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )

        existing_expense.title = expense.title
        existing_expense.amount = expense.amount
        existing_expense.category = expense.category
        existing_expense.date = expense.date
        existing_expense.payment_method = expense.payment_method
        existing_expense.notes = expense.notes

        db.commit()

        return {
            "message": "Expense updated successfully"
        }

    finally:
        db.close()

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):

    db = SessionLocal()

    try:
        expense = db.query(Expense).filter(
            Expense.id == expense_id
        ).first()

        if not expense:
            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )

        db.delete(expense)
        db.commit()

        return {
            "message": "Expense deleted successfully"
        }

    finally:
        db.close()
    
# ---------------- INCOME APIs ----------------

@app.post("/income")
def add_income(income: IncomeCreate):
    db = SessionLocal()

    try:
        new_income = Income(
            title=income.title,
            amount=income.amount,
            category=income.category,
            date=income.date,
            payment_method=income.payment_method,
            notes=income.notes
        )

        db.add(new_income)
        db.commit()
        db.refresh(new_income)

        return new_income

    finally:
        db.close()


@app.get("/income")
def get_income():
    db = SessionLocal()

    try:
        return db.query(Income).order_by(Income.date.desc()).all()

    finally:
        db.close()


@app.put("/income/{income_id}")
def update_income(income_id: int, income: IncomeCreate):
    db = SessionLocal()

    try:
        existing_income = db.query(Income).filter(
            Income.id == income_id
        ).first()

        if existing_income is None:
            raise HTTPException(
                status_code=404,
                detail="Income not found"
            )

        existing_income.title = income.title
        existing_income.amount = income.amount
        existing_income.category = income.category
        existing_income.date = income.date
        existing_income.payment_method = income.payment_method
        existing_income.notes = income.notes

        db.commit()
        db.refresh(existing_income)

        return existing_income

    finally:
        db.close()


@app.delete("/income/{income_id}")
def delete_income(income_id: int):
    db = SessionLocal()

    try:
        existing_income = db.query(Income).filter(
            Income.id == income_id
        ).first()

        if existing_income is None:
            raise HTTPException(
                status_code=404,
                detail="Income not found"
            )

        db.delete(existing_income)
        db.commit()

        return {"message": "Income deleted successfully"}

    finally:
        db.close()

# ADD HABIT
@app.post("/habits")
def add_habit(habit: HabitCreate):
    db = SessionLocal()

    new_habit = Habit(
        name=habit.name,
        category=habit.category,
        description=habit.description,
        created_at=habit.created_at
    )

    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)

    db.close()

    return new_habit


# GET ALL HABITS
@app.get("/habits")
def get_habits():
    db = SessionLocal()

    habits = db.query(Habit).order_by(Habit.id.desc()).all()

    db.close()

    return habits


# UPDATE HABIT
@app.put("/habits/{habit_id}")
def update_habit(habit_id: int, habit: HabitCreate):
    db = SessionLocal()

    existing_habit = db.query(Habit).filter(
        Habit.id == habit_id
    ).first()

    if not existing_habit:
        db.close()
        return {"error": "Habit not found"}

    existing_habit.name = habit.name
    existing_habit.category = habit.category
    existing_habit.description = habit.description
    existing_habit.created_at = habit.created_at

    db.commit()
    db.refresh(existing_habit)
    db.close()

    return existing_habit


# DELETE HABIT
@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int):
    db = SessionLocal()

    habit = db.query(Habit).filter(
        Habit.id == habit_id
    ).first()

    if not habit:
        db.close()
        return {"error": "Habit not found"}

    db.delete(habit)
    db.commit()
    db.close()

    return {"message": "Habit deleted successfully"}

@app.post("/habit-logs")
def create_habit_log(log: HabitLogCreate, db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == log.habit_id).first()

    if not habit:
        return {"error": "Habit not found"}

    existing_log = db.query(HabitLog).filter(
        HabitLog.habit_id == log.habit_id,
        HabitLog.completed_date == log.completed_date
    ).first()

    if existing_log:
        existing_log.is_completed = log.is_completed
        db.commit()
        db.refresh(existing_log)
        return existing_log

    new_log = HabitLog(
        habit_id=log.habit_id,
        completed_date=log.completed_date,
        is_completed=log.is_completed
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return new_log


@app.get("/habit-logs")
def get_habit_logs(db: Session = Depends(get_db)):
    return db.query(HabitLog).all()

@app.post("/focus-sessions")
def create_focus_session(
    session: FocusSessionCreate,
    db: Session = Depends(get_db)
):
    new_session = FocusSession(
        title=session.title,
        duration_minutes=session.duration_minutes,
        session_date=session.session_date,
        is_completed=session.is_completed
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session


@app.get("/focus-sessions")
def get_focus_sessions(db: Session = Depends(get_db)):
    return db.query(FocusSession).all()

@app.get("/ai-insights")
def get_ai_insights(db: Session = Depends(get_db)):

    sessions = (
        db.query(FocusSession)
        .order_by(FocusSession.session_date.desc())
        .limit(30)
        .all()
    )

    if not sessions:
        return {"insights": "Complete some focus sessions first!"}

    focus_data = [
        {
            "title": session.title,
            "duration": session.duration_minutes,
            "date": str(session.session_date),
        }
        for session in sessions
        if session.is_completed
    ]

    if not focus_data:
        return {"insights": "No completed focus sessions available."}

    prompt = f"""
    You are the AI productivity assistant inside LifeLens.

    Analyze these focus sessions:
    {focus_data}

    Provide:
    1. Productivity summary.
    2. Strongest productivity pattern.
    3. Areas for improvement.
    4. Three personalized recommendations.

    Keep the response friendly and concise.
    """

    for attempt in range(3):
        try:
            print(f"Sending request to Gemini... Attempt {attempt + 1}/3")

            response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=prompt
            )

            print("Gemini response received!")

            return {
                "insights": response.text,
                "status": "success"
            }

        except Exception as e:
            error_message = str(e)
            print("Gemini Error:", error_message)

            if ("503" in error_message or "504" in error_message) and attempt < 2:
                wait_time = 2 ** (attempt + 1)
                print(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                return {
                    "insights": "AI insights are temporarily unavailable. Please try again later.",
                    "status": "unavailable"
                }