# 🌌 LifeLens

**An AI-powered personal insights and analytics platform.**

LifeLens uses data analysis and artificial intelligence to transform information into meaningful insights and personalized recommendations.

Built with React, TypeScript, FastAPI, PostgreSQL and Google's Gemini AI, LifeLens combines a modern user interface with intelligent backend processing.

## ✨ Features

- **Interactive Dashboard:** Explore personal insights through a modern dashboard.
- **AI-Powered Insights:** Generate intelligent insights using Google's Gemini AI.
- **Data Analysis:** Process and analyze information to identify meaningful patterns.
- **Modern UI:** Enjoy a clean, responsive interface with a premium dark theme.
- **Backend API:** FastAPI-powered backend for application logic and data processing.
- **Database Integration:** PostgreSQL database integration for data management.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, TypeScript |
| Build Tool | Vite |
| Styling | CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| AI Integration | Google Gemini API |
| ORM | SQLAlchemy |
| Version Control | Git, GitHub |

## 📁 Project Structure

```text
LifeLens/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder and add:

```env
GEMINI_API_KEY=your_gemini_api_key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password


## 🚀 Getting Started

Follow these steps to run LifeLens locally.

### 1. Clone the Repository

```bash
git clone https://github.com/MahikaMishra27/LifeLens.git
cd LifeLens
```

### 2. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Set Up the Backend

Open a new terminal:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Start the backend server:

```bash
python -m uvicorn main:app --reload
```

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` folder and add your own Gemini API key and PostgreSQL database credentials.

Refer to the Environment Variables section for the required variables.

## 🤖 AI Integration

LifeLens integrates Google's Gemini API to generate AI-powered insights.

The backend communicates with the Gemini model, processes the generated responses and delivers meaningful insights to the frontend.

The application uses environment variables to securely manage API credentials.

## 👩‍💻 Author

**Mahika Mishra**

Engineering Student | Aspiring AI & Data Science Developer

- GitHub: [MahikaMishra27](https://github.com/MahikaMishra27)

---

⭐ If you find this project interesting, consider giving it a star!

