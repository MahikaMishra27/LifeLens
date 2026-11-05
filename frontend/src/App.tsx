
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  Target,
  Clock3,
  BrainCircuit,
  Settings,
  Search,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Sparkles,
  MoreHorizontal,
  TrendingUp,
  IndianRupee,
  Layers,
  CheckCircle,
  Moon,
  Sun
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "./App.css";

const weeklyData = [
  { day: "Mon", spending: 450, productivity: 5 },
  { day: "Tue", spending: 320, productivity: 7 },
  { day: "Wed", spending: 600, productivity: 6 },
  { day: "Thu", spending: 280, productivity: 8 },
  { day: "Fri", spending: 520, productivity: 7 },
  { day: "Sat", spending: 750, productivity: 4 },
  { day: "Sun", spending: 400, productivity: 8 },
];

const expenseData = [
  { name: "Food", value: 35, color: "#9270ff" },
  { name: "Shopping", value: 25, color: "#c084fc" },
  { name: "Travel", value: 20, color: "#38bdf8" },
  { name: "Others", value: 20, color: "#64748b" },
];

const navItems = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Expenses", icon: Wallet },
  { name: "Income", icon: Wallet },
  { name: "Habits", icon: Target },
  { name: "Productivity", icon: Clock3 },
  { name: "AI Insights", icon: BrainCircuit },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [apiStatus, setApiStatus] = useState<string>("Checking...");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [aiInsights, setAiInsights] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [profile, setProfile] = useState<{
  id: number;
  full_name: string;
  email: string;
  avatar_url: string | null;
} | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    payment_method: "UPI",
  });

  const [expenseSearch, setExpenseSearch] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("All");
  const [income, setIncome] = useState<any[]>([]);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);

  const [newIncome, setNewIncome] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    payment_method: "UPI",
    notes: "",
  });
  const [habits, setHabits] = useState<any[]>([]);
  const [habitLogs, setHabitLogs] = useState<any[]>([]);
  const [focusSessions, setFocusSessions] = useState<any[]>([]);

  const [focusTitle, setFocusTitle] = useState("");
  const [focusDuration, setFocusDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false); 
  const today = new Date().toLocaleDateString("en-CA");

const completedToday = habits.filter((habit) =>
  habitLogs.some(
    (log) =>
      log.habit_id === habit.id &&
      log.completed_date === today &&
      log.is_completed === true
  )
).length;

const habitProgress =
  habits.length > 0
    ? Math.round((completedToday / habits.length) * 100)
    : 0;
  
const calculateHabitStreak = (habitId: number) => {
  const completedDates = new Set(
    habitLogs
      .filter(
        (log) =>
          log.habit_id === habitId &&
          log.is_completed === true
      )
      .map((log) => log.completed_date)
  );

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayDate = new Date();
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  let currentDate: Date;

  if (completedDates.has(formatDate(todayDate))) {
    currentDate = todayDate;
  } else if (completedDates.has(formatDate(yesterdayDate))) {
    currentDate = yesterdayDate;
  } else {
    return 0;
  }

  let streak = 0;

  while (completedDates.has(formatDate(currentDate))) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

const getLastSevenDays = () => {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    days.push({
      date: `${year}-${month}-${day}`,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }

  return days;
};
const totalFocusMinutes = focusSessions.reduce(
  (total, session) => total + Number(session.duration_minutes),
  0
);

const completedFocusSessions = focusSessions.filter(
  (session) => session.is_completed
).length;

const totalFocusHours = Math.floor(totalFocusMinutes / 60);
const remainingFocusMinutes = totalFocusMinutes % 60;
const getLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const currentWeekDate = new Date();
const dayOfWeek = currentWeekDate.getDay();
const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

const monday = new Date(currentWeekDate);
monday.setDate(currentWeekDate.getDate() + mondayOffset);

const [dailyFocusGoal, setDailyFocusGoal] = useState(() => {
  const savedGoal = localStorage.getItem("dailyFocusGoal");
  return savedGoal ? Number(savedGoal) : 120;
});

const todayFocusMinutes = focusSessions
  .filter(
    (session) =>
      session.session_date === getLocalDateKey(new Date()) &&
      session.is_completed
  )
  .reduce(
    (total, session) => total + Number(session.duration_minutes),
    0
  );

const dailyGoalProgress = Math.min(
  (todayFocusMinutes / dailyFocusGoal) * 100,
  100
);

const weeklyFocusData = Array.from({ length: 7 }, (_, index) => {
  const date = new Date(monday);
  date.setDate(monday.getDate() + index);

  const dateKey = getLocalDateKey(date);

  const minutes = focusSessions
    .filter(
      (session) =>
        session.session_date === dateKey && session.is_completed
    )
    .reduce(
      (total, session) => total + Number(session.duration_minutes),
      0
    );

  return {
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    minutes,
  };
});
const totalWeeklyFocusMinutes = weeklyFocusData.reduce(
  (total, day) => total + day.minutes,
  0
);

const averageDailyFocusMinutes = Math.round(
  totalWeeklyFocusMinutes / 7
);

const mostProductiveDay = weeklyFocusData.reduce(
  (bestDay, currentDay) =>
    currentDay.minutes > bestDay.minutes ? currentDay : bestDay,
  weeklyFocusData[0]
);

const hasWeeklyFocus = totalWeeklyFocusMinutes > 0;
const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;

const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

const lastSevenDays = getLastSevenDays();

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);

  const [newHabit, setNewHabit] = useState({
    name: "",
    category: "",
    description: "",
    created_at: new Date().toISOString().split("T")[0],
  });

  const fetchAIInsights = async () => {
  setAiLoading(true);
  setAiStatus("");

  try {
    const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000);

const response = await fetch(
  "http://127.0.0.1:8001/ai-insights",
  { signal: controller.signal }
);

clearTimeout(timeout);
    const data = await response.json();

    setAiInsights(data.insights || "");
    setAiStatus(data.status || "success");
  } catch (error) {
    console.error("AI Insights Error:", error);
    setAiInsights("Unable to connect to the AI service.");
    setAiStatus("unavailable");
  } finally {
    setAiLoading(false);
  }
};

useEffect(() => {
  fetch("http://127.0.0.1:8001/health")
    .then((response) => response.json())
    .then((data) => setApiStatus(data.status))
    .catch(() => setApiStatus("Disconnected"));

  fetch("http://127.0.0.1:8001/expenses")
    .then((response) => response.json())
    .then((data) => setExpenses(data))
    .catch((error) => console.error("Error fetching expenses:", error));

  fetch("http://127.0.0.1:8001/income")
    .then((response) => response.json())
    .then((data) => setIncome(data))
    .catch((error) => console.error("Error fetching income:", error));

  fetch("http://127.0.0.1:8001/habits")
    .then((response) => response.json())
    .then((data) => setHabits(data))
    .catch((error) => console.error("Error fetching habits:", error));
  fetch("http://127.0.0.1:8001/habit-logs")
  .then((response) => response.json())
  .then((data) => setHabitLogs(data))
  .catch((error) => console.error("Error fetching habit logs:", error));
  fetch("http://127.0.0.1:8001/focus-sessions")
  .then((response) => response.json())
  .then((data) => setFocusSessions(data))
  .catch((error) =>
    console.error("Error fetching focus sessions:", error)
  );
  fetch("http://127.0.0.1:8001/focus-sessions")
    .then((response) => response.json())
    .then((data) => setFocusSessions(data))
    .catch((error) =>
      console.error("Error fetching focus sessions:", error)
    );

// ADD THE PROFILE FETCH HERE
fetch("http://127.0.0.1:8001/profile?email=test%40example.com")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Profile could not be loaded");
    }

    return response.json();
  })
  .then((data) => setProfile(data))
  .catch((error) =>
    console.error("Error fetching profile:", error)
  );

// The existing useEffect closing stays below

}, []);
const handleUpdateProfile = async () => {
  if (!profile) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8001/profile/${profile.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: editName,
          email: editEmail,
          avatar_url: profile.avatar_url,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Could not update profile");
    }

    setProfile(data);
    setIsEditingProfile(false);
    setProfileMessage("Profile updated successfully!");
  } catch (error) {
    setProfileMessage(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

useEffect(() => {
  if (!timerRunning) return;

  const timer = setInterval(() => {
    setTimeLeft((previousTime) => {
      if (previousTime <= 1) {
  clearInterval(timer);
  setTimerRunning(false);
  saveFocusSession();
  return 0;
}
      return previousTime - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [timerRunning, focusTitle, focusDuration]);
  console.log(expenses);
  const totalExpenses = expenses.reduce(
  (total, expense) => total + Number(expense.amount),
  0
);
  const totalIncome = income.reduce(
  (total, item) => total + Number(item.amount),
  0
);
  const handleAddExpense = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  try {
    const url = editingExpenseId
      ? `http://127.0.0.1:8001/expenses/${editingExpenseId}`
      : "http://127.0.0.1:8001/expenses";

    const response = await fetch(url, {
      method: editingExpenseId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newExpense,
        amount: Number(newExpense.amount),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save expense");
    }

    const updatedExpenses = await fetch(
      "http://127.0.0.1:8001/expenses"
    );

  

    const data = await updatedExpenses.json();
    setExpenses(data);

    setNewExpense({
      title: "",
      amount: "",
      category: "",
      date: "",
      payment_method: "UPI",
    });

    setShowAddExpense(false);

    alert("Expense added successfully!");

  } catch (error) {
    console.error(error);
    alert("Could not save expense. Please try again.");
  }
};
const handleAddIncome = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  try {
    const url = editingIncomeId
      ? `http://127.0.0.1:8001/income/${editingIncomeId}`
      : "http://127.0.0.1:8001/income";

    const response = await fetch(url, {
      method: editingIncomeId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newIncome,
        amount: Number(newIncome.amount),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save income");
    }

    const updatedResponse = await fetch(
  "http://127.0.0.1:8001/income"
);

if (!updatedResponse.ok) {
  throw new Error("Could not refresh income records");
}

const data = await updatedResponse.json();
setIncome(data);

    setNewIncome({
      title: "",
      amount: "",
      category: "",
      date: "",
      payment_method: "UPI",
      notes: "",
    });

    setEditingIncomeId(null);
    setShowAddIncome(false);

    alert(
      editingIncomeId
        ? "Income updated successfully!"
        : "Income added successfully!"
    );

  } catch (error) {
    console.error(error);
    alert("Could not save income. Please try again.");
  }
};
  const handleAddHabit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  try {
    const url = editingHabitId
      ? `http://127.0.0.1:8001/habits/${editingHabitId}`
      : "http://127.0.0.1:8001/habits";

    const response = await fetch(url, {
      method: editingHabitId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHabit),
    });

    if (!response.ok) {
      throw new Error("Failed to save habit");
    }

    const updatedResponse = await fetch(
      "http://127.0.0.1:8001/habits"
    );

    const data = await updatedResponse.json();
    setHabits(data);

    setNewHabit({
      name: "",
      category: "",
      description: "",
      created_at: new Date().toISOString().split("T")[0],
    });

    setEditingHabitId(null);
    setShowAddHabit(false);

    alert(
      editingHabitId
        ? "Habit updated successfully!"
        : "Habit added successfully!"
    );

  } catch (error) {
    console.error(error);
    alert("Could not save habit. Please try again.");
  }
};
  const saveFocusSession = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8001/focus-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: focusTitle,
        duration_minutes: focusDuration,
        session_date: new Date().toISOString().split("T")[0],
        is_completed: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save focus session");
    }

    const savedSession = await response.json();

    setFocusSessions((previousSessions) => [
      ...previousSessions,
      savedSession,
    ]);

    alert("Focus session saved successfully!");
  } catch (error) {
    console.error("Error saving focus session:", error);
    alert("Could not save your focus session.");
  }
};
  const handleStartTimer = () => {
  if (!focusTitle.trim()) {
    alert("Please enter what you want to focus on.");
    return;
  }

  if (timeLeft <= 0) {
    setTimeLeft(focusDuration * 60);
  }

  setTimerRunning(true);
};

const handlePauseTimer = () => {
  setTimerRunning(false);
};

const handleResetTimer = () => {
  setTimerRunning(false);
  setTimeLeft(focusDuration * 60);
};
  const handleEditHabit = (habit: any) => {
  setEditingHabitId(habit.id);

  setNewHabit({
    name: habit.name,
    category: habit.category,
    description: habit.description || "",
    created_at: habit.created_at,
  });

  setShowAddHabit(true);
};
  const handleDeleteHabit = async (habitId: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this habit?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8001/habits/${habitId}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete habit");
    }

    const updatedResponse = await fetch(
      "http://127.0.0.1:8001/habits"
    );

    const data = await updatedResponse.json();
    setHabits(data);

    alert("Habit deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Could not delete habit. Please try again.");
  }
};
  const handleToggleHabit = async (habitId: number, isCompleted: boolean) => {
  const today = new Date().toLocaleDateString("en-CA");

  try {
    const response = await fetch("http://127.0.0.1:8001/habit-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        habit_id: habitId,
        completed_date: today,
        is_completed: isCompleted,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update habit");
    }

    const updatedLog = await response.json();

    setHabitLogs((previousLogs) => {
      const existingIndex = previousLogs.findIndex(
        (log) =>
          log.habit_id === habitId &&
          log.completed_date === today
      );

      if (existingIndex !== -1) {
        const updatedLogs = [...previousLogs];
        updatedLogs[existingIndex] = updatedLog;
        return updatedLogs;
      }

      return [...previousLogs, updatedLog];
    });
  } catch (error) {
    console.error("Error updating habit:", error);
    alert("Could not update habit. Please try again.");
  }
};
  const handleEditIncome = (item: any) => {
  setEditingIncomeId(item.id);

  setNewIncome({
    title: item.title,
    amount: String(item.amount),
    category: item.category,
    date: item.date,
    payment_method: item.payment_method || "UPI",
    notes: item.notes || "",
  });

  setShowAddIncome(true);
};
  const handleDeleteIncome = async (incomeId: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this income?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8001/income/${incomeId}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete income");
    }

    const updatedResponse = await fetch(
      "http://127.0.0.1:8001/income"
    );

    const data = await updatedResponse.json();
    setIncome(data);

    alert("Income deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Could not delete income. Please try again.");
  }
};
  const handleDeleteExpense = async (expenseId: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this expense?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8001/expenses/${expenseId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete expense");
    }

    const updatedResponse = await fetch(
      "http://127.0.0.1:8001/expenses"
    );

    const data = await updatedResponse.json();
    setExpenses(data);

    alert("Expense deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Could not delete expense. Please try again.");
  }
};
  const handleEditExpense = (expense: any) => {
  setEditingExpenseId(expense.id);

  setNewExpense({
    title: expense.title,
    amount: String(expense.amount),
    category: expense.category,
    date: expense.date,
    payment_method: expense.payment_method || "UPI",
  });

  setShowAddExpense(true);
};

const chartColors = [
  "#8b7cf6",
  "#42c6a5",
  "#f5a65b",
  "#ef6464",
  "#5b9cf6",
  "#d77cf6",
];

const categoryData = expenses.reduce((acc: any[], expense) => {
  const existingCategory = acc.find(
    (item) => item.name === expense.category
  );

  if (existingCategory) {
    existingCategory.value += Number(expense.amount);
  } else {
    acc.push({
      name: expense.category,
      value: Number(expense.amount),
    });
  }

  return acc;
}, []);

const filteredExpenses = expenses.filter((expense) => {
  const matchesSearch = expense.title
    .toLowerCase()
    .includes(expenseSearch.toLowerCase());

  const matchesCategory =
    expenseCategory === "All" ||
    expense.category === expenseCategory;

  return matchesSearch && matchesCategory;
});
   
  
  return (
    <div className={`app ${theme}-theme`}>
      {showAddExpense && (
  <div className="expense-modal-overlay">
    <div className="expense-modal">

      <div className="expense-modal-header">
        <div>
          {editingExpenseId ? "Edit Expense" : "Add New Expense"}
          <p>Record your spending details.</p>
        </div>

        <button
          className="expense-modal-close"
          type="button"
          onClick={() => setShowAddExpense(false)}
        >
          ×
        </button>
      </div>

      <form className="expense-form" onSubmit={handleAddExpense}>

        <div className="expense-form-group">
          <label>Expense Name</label>
          <input
            type="text"
            placeholder="e.g. Shopping, Lunch"
            value={newExpense.title}
            onChange={(e) =>
              setNewExpense({ ...newExpense, title: e.target.value })
            }
            required
          />
        </div>

        <div className="expense-form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            placeholder="Enter amount"
            min="0.01"
            step="0.01"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            required
          />
        </div>

        <div className="expense-form-group">
          <label>Category</label>
          <select
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            required
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="expense-form-group">
          <label>Date</label>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date: e.target.value })
            }
            required
          />
        </div>

        <div className="expense-form-group">
          <label>Payment Method</label>
          <select
            value={newExpense.payment_method}
            onChange={(e) =>
              setNewExpense({
                ...newExpense,
                payment_method: e.target.value,
              })
            }
          >
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
        </div>

        <div className="expense-form-actions">
          <button
            type="button"
            className="expense-cancel-button"
            onClick={() => setShowAddExpense(false)}
          >
            Cancel
          </button>

          <button type="submit" className="expense-submit-button">
           {editingExpenseId ? "Update Expense" : "Save Expense"}
          </button>
        </div>

      </form>
    </div>
  </div>
)}
{showAddIncome && (
  <div className="expense-modal-overlay">
    <div className="expense-modal">

      <div className="expense-modal-header">
        <div>
          {editingIncomeId ? "Edit Income" : "Add New Income"}
          <p>Record your earnings details.</p>
        </div>

        <button
          className="expense-modal-close"
          type="button"
          onClick={() => {
            setShowAddIncome(false);
            setEditingIncomeId(null);
          }}
        >
          ×
        </button>
      </div>

      <form className="expense-form" onSubmit={handleAddIncome}>

        <div className="expense-form-group">
          <label>Income Source</label>
          <input
            type="text"
            placeholder="e.g. Salary, Freelancing"
            value={newIncome.title}
            onChange={(e) =>
              setNewIncome({ ...newIncome, title: e.target.value })
            }
            required
          />
        </div>

        <div className="expense-form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            placeholder="Enter amount"
            min="0.01"
            step="0.01"
            value={newIncome.amount}
            onChange={(e) =>
              setNewIncome({ ...newIncome, amount: e.target.value })
            }
            required
          />
        </div>

        <div className="expense-form-group">
          <label>Category</label>
          <select
            value={newIncome.category}
            onChange={(e) =>
              setNewIncome({ ...newIncome, category: e.target.value })
            }
            required
          >
            <option value="">Select category</option>
            <option value="Salary">Salary</option>
            <option value="Freelancing">Freelancing</option>
            <option value="Business">Business</option>
            <option value="Investment">Investment</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Gift">Gift</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="expense-form-group">
          <label>Date</label>
          <input
            type="date"
            value={newIncome.date}
            onChange={(e) =>
              setNewIncome({ ...newIncome, date: e.target.value })
            }
            required
          />
        </div>

        <div className="expense-form-group">
          <label>Payment Method</label>
          <select
            value={newIncome.payment_method}
            onChange={(e) =>
              setNewIncome({
                ...newIncome,
                payment_method: e.target.value,
              })
            }
          >
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
        </div>

        <div className="expense-form-group">
          <label>Notes (Optional)</label>
          <input
            type="text"
            placeholder="Add a note"
            value={newIncome.notes}
            onChange={(e) =>
              setNewIncome({ ...newIncome, notes: e.target.value })
            }
          />
        </div>

        <div className="expense-form-actions">
          <button
            type="button"
            className="expense-cancel-button"
            onClick={() => {
              setShowAddIncome(false);
              setEditingIncomeId(null);
            }}
          >
            Cancel
          </button>

          <button type="submit" className="expense-submit-button">
            {editingIncomeId ? "Update Income" : "Save Income"}
          </button>
        </div>

      </form>
    </div>
  </div>
)}
{showAddHabit && (
  <div className="expense-modal-overlay">
    <div className="expense-modal">

      <div className="expense-modal-header">
        <div>
          {editingHabitId ? "Edit Habit" : "Add New Habit"}
          <p>Create a routine and build consistency.</p>
        </div>

        <button
          className="expense-modal-close"
          type="button"
          onClick={() => {
            setShowAddHabit(false);
            setEditingHabitId(null);
          }}
        >
          ×
        </button>
      </div>

      <form className="expense-form" onSubmit={handleAddHabit}>

        <div className="expense-form-group">
          <label>Habit Name</label>
          <input
            type="text"
            placeholder="e.g. Morning Exercise"
            value={newHabit.name}
            onChange={(e) =>
              setNewHabit({ ...newHabit, name: e.target.value })
            }
            required
          />
        </div>

        <div className="expense-form-group">
          <label>Category</label>
          <select
            value={newHabit.category}
            onChange={(e) =>
              setNewHabit({ ...newHabit, category: e.target.value })
            }
            required
          >
            <option value="">Select category</option>
            <option value="Health">Health</option>
            <option value="Fitness">Fitness</option>
            <option value="Study">Study</option>
            <option value="Personal">Personal</option>
            <option value="Productivity">Productivity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="expense-form-group">
          <label>Description (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Exercise for 30 minutes"
            value={newHabit.description}
            onChange={(e) =>
              setNewHabit({ ...newHabit, description: e.target.value })
            }
          />
        </div>

        <div className="expense-form-actions">
          <button
            type="button"
            className="expense-cancel-button"
            onClick={() => {
              setShowAddHabit(false);
              setEditingHabitId(null);
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="expense-submit-button"
          >
            {editingHabitId ? "Update Habit" : "Save Habit"}
          </button>
        </div>

      </form>
    </div>
  </div>
)}
      <p>Backend Status: {apiStatus}</p>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">L</div>
          <span>LifeLens</span>
        </div>

        <div className="workspace">
          <span className="workspace-dot"></span>
          Personal Workspace
        </div>

        <p className="nav-heading">MENU</p>

        <nav className="navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
  className={`nav-item ${activePage === "Settings" ? "active" : ""}`}
  onClick={() => setActivePage("Settings")}
>
  <Settings size={19} />
  Settings
</button>

          <div className="profile">
  <div className="avatar">
    {profile?.full_name?.charAt(0).toUpperCase() || "M"}
  </div>

  <div>
    <h4>{profile?.full_name || "My Account"}</h4>
    <p>{profile?.email || "Personal Plan"}</p>
  </div>

  <MoreHorizontal size={19} />
</div>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {activePage}
          </div>

          <div className="top-actions">
            <button className="icon-button">
              <Search size={19} />
            </button>
            <button className="icon-button notification">
              <Bell size={19} />
              <span></span>
            </button>
            <div className="avatar">M</div>
          </div>
        </header>

        <section className="dashboard">
          {activePage === "Expenses" ? (
  <div className="expenses-page">

    <div className="welcome-row">
      <div>
        <h1>Expense Tracker</h1>
        <p>Track and manage all your expenses in one place.</p>
      </div>

      <button
        className="add-button"
        onClick={() => setShowAddExpense(true)}
      >
        <Plus size={18} />
        Add Expense
      </button>
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <p>Total Expenses</p>
        <h2>₹{totalExpenses.toLocaleString("en-IN")}</h2>
      </div>

      <div className="stat-card">
        <p>Total Transactions</p>
        <h2>{expenses.length}</h2>
      </div>

      <div className="stat-card">
        <p>Average Expense</p>
        <h2>
          ₹{expenses.length
            ? Math.round(totalExpenses / expenses.length).toLocaleString("en-IN")
            : 0}
        </h2>
      </div>
    </div>
    
<div className="expense-chart-card">
  <h3>Spending by Category</h3>
  <p>Your expense distribution</p>

  {categoryData.length > 0 ? (
    <div className="expense-chart">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={4}
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <p>No expense data available yet.</p>
  )}

  <div className="expense-chart-legend">
    {categoryData.map((item, index) => (
      <div className="legend-item" key={item.name}>
        <span
          className="legend-dot"
          style={{
            backgroundColor:
              chartColors[index % chartColors.length],
          }}
        />
        <span>{item.name}</span>
        <strong>₹{item.value.toFixed(2)}</strong>
      </div>
    ))}
  </div>
</div>


    <div className="expense-transactions">
      <h2>All Transactions</h2>
      <p>View and manage your spending history.</p>

      <div className="expense-filters">
        <input
          type="text"
          placeholder="Search expenses..."
          value={expenseSearch}
          onChange={(e) => setExpenseSearch(e.target.value)}
        />

        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {[...new Set(expenses.map((expense) => expense.category))].map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </div>

      <div className="expense-table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Expense</th>
              <th>Category</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          
<tbody>
  {filteredExpenses.length > 0 ? (
    filteredExpenses.map((expense) => (
      <tr key={expense.id}>
        <td>{expense.title}</td>

        <td>{expense.category}</td>

        <td>
          {new Date(
            expense.date + "T00:00:00"
          ).toLocaleDateString("en-IN")}
        </td>

        <td>{expense.payment_method || "—"}</td>

        <td className="expense-amount">
          -₹{Number(expense.amount).toLocaleString("en-IN")}
        </td>

        <td>
          <button
            type="button"
            onClick={() => handleEditExpense(expense)}
            className="edit-expense-button"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleDeleteExpense(expense.id)}
            className="delete-expense-button"
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="empty-expenses">
        No expenses found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>

  </div>
) : activePage === "Income" ? (
  <div className="expenses-page">

    <div className="welcome-row">
      <div>
        <p className="date-label">INCOME MANAGEMENT</p>
        <h1>Income Tracker <span>✦</span></h1>
        <p className="welcome-subtitle">
          Track and manage your earnings in one place.
        </p>
      </div>

      <button
        className="add-button"
        onClick={() => {
          setEditingIncomeId(null);
          setNewIncome({
            title: "",
            amount: "",
            category: "",
            date: "",
            payment_method: "UPI",
            notes: "",
          });
          setShowAddIncome(true);
        }}
      >
        <Plus size={18} />
        Add Income
      </button>
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-top">
          <span>Total Income</span>
          <div className="stat-icon purple">
            <Wallet size={19} />
          </div>
        </div>

        <h2>₹{totalIncome.toLocaleString("en-IN")}</h2>
        <p className="stat-description">All recorded earnings</p>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Total Transactions</span>
          <div className="stat-icon green">
            <TrendingUp size={19} />
          </div>
        </div>

        <h2>{income.length}</h2>
        <p className="stat-description">Income records</p>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Average Income</span>
          <div className="stat-icon orange">
            <IndianRupee size={19} />
          </div>
        </div>

        <h2>
          ₹{income.length
            ? Math.round(totalIncome / income.length).toLocaleString("en-IN")
            : 0}
        </h2>
        <p className="stat-description">Per transaction</p>
      </div>
    </div>

    <div className="expense-transactions">
      <div className="section-heading">
        <div>
          <h2>Income Transactions</h2>
          <p>Your complete earnings history</p>
        </div>
      </div>

      <div className="expense-table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Category</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {income.length > 0 ? (
              income.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.date}</td>
                  <td>{item.payment_method || "N/A"}</td>
                  <td>
                    <span className="income-amount">
                      +₹{Number(item.amount).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEditIncome(item)}
                      className="edit-expense-button"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteIncome(item.id)}
                      className="delete-expense-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-expenses">
                  No income records yet. Click Add Income to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  </div>
  
) : activePage === "Habits" ? (
  <div className="expenses-page">

    <div className="welcome-row">
      <div>
        <p className="date-label">BUILD BETTER ROUTINES</p>
        <h1>Habit Tracker <span>✦</span></h1>
        <p className="welcome-subtitle">
          Small daily actions create remarkable results.
        </p>
      </div>

      <button
        className="add-button"
        onClick={() => {
          setEditingHabitId(null);
          setNewHabit({
            name: "",
            category: "",
            description: "",
            created_at: new Date().toISOString().split("T")[0],
          });
          setShowAddHabit(true);
        }}
      >
        <Plus size={18} />
        Add Habit
      </button>
    </div>

    <div className="stats-grid">

      <div className="stat-card">
        <div className="stat-top">
          <span>Total Habits</span>
          <div className="stat-icon purple">
            <Target size={19} />
          </div>
        </div>
        <h2>{habits.length}</h2>
        <p className="stat-description">Your active habits</p>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Habit Categories</span>
          <div className="stat-icon green">
            <Layers size={19} />
          </div>
        </div>
        <h2>{new Set(habits.map((habit) => habit.category)).size}</h2>
        <p className="stat-description">Different areas of life</p>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Today's Progress</span>
          <div className="stat-icon orange">
            <CheckCircle size={19} />
          </div>
        </div>
        <h2>{habitProgress}%</h2>
<p className="stat-description">
  {completedToday} of {habits.length} habits completed
</p>
      </div>

    </div>

    <div className="expense-transactions">

      <div className="section-heading">
        <div>
          <h2>My Daily Habits</h2>
          <p>Build consistency, one day at a time.</p>
        </div>
      </div>

      {habits.length > 0 ? (
        <div className="habit-list">
          {habits.map((habit) => (
            <div className="habit-item" key={habit.id}>

  <div className="habit-info">
  <h3>{habit.name}</h3>
  <p>{habit.category}</p>

  {habit.description && <p>{habit.description}</p>}

  <div className="habit-streak">
    <span>🔥</span>
    <strong>{calculateHabitStreak(habit.id)} day streak</strong>
  </div>
</div>
<div className="habit-week">
  {lastSevenDays.map((day) => {
    const isCompleted = habitLogs.some(
      (log) =>
        log.habit_id === habit.id &&
        log.completed_date === day.date &&
        log.is_completed === true
    );

    return (
      <div className="habit-week-day" key={day.date}>
        <span>{day.label}</span>

        <div className={`habit-week-box ${isCompleted ? "completed" : ""}`}>
          {isCompleted ? "✓" : "–"}
        </div>
      </div>
    );
  })}
</div>

  <div className="habit-actions">

    <label className="habit-checkbox">
      <input
        type="checkbox"
        checked={habitLogs.some(
          (log) =>
            log.habit_id === habit.id &&
            log.completed_date === new Date().toLocaleDateString("en-CA") &&
            log.is_completed === true
        )}
        onChange={(e) =>
          handleToggleHabit(habit.id, e.target.checked)
        }
      />
      <span>Done today</span>
    </label>

    <button
      type="button"
      className="edit-expense-button"
      onClick={() => handleEditHabit(habit)}
    >
      Edit
    </button>

    <button
      type="button"
      className="delete-expense-button"
      onClick={() => handleDeleteHabit(habit.id)}
    >
      Delete
    </button>

  </div>

</div>
          ))}
        </div>
      ) : (
        <div className="empty-expenses">
          No habits added yet. Click Add Habit to get started!
        </div>
      )}

    </div>

  </div>
) : activePage === "Productivity" ? (
  <div className="page-container">
    <div className="page-header">
      <div>
        <h1>Productivity & Focus</h1>
        <p>Stay focused. Make every minute count.</p>
      </div>
    </div>
    

    <div className="focus-card">
      <div className="focus-stats-grid">
  <div className="focus-stat-card">
    <p>Total Focus Time</p>
    <h2>
      {totalFocusHours}h {remainingFocusMinutes}m
    </h2>
  </div>

  <div className="focus-stat-card">
    <p>Completed Sessions</p>
    <h2>{completedFocusSessions}</h2>
  </div>
</div>
      <h2>Pomodoro Focus Timer</h2>
      <p>What are you focusing on today?</p>

      <input
        type="text"
        placeholder="e.g. Python Practice"
        value={focusTitle}
        onChange={(e) => setFocusTitle(e.target.value)}
      />

      <div className="focus-duration">
        <label>Focus duration</label>
        <select
          value={focusDuration}
          onChange={(e) => {
            const duration = Number(e.target.value);
            setFocusDuration(duration);
            setTimeLeft(duration * 60);
            setTimerRunning(false);
          }}
          disabled={timerRunning}
        > 
          
          <option value={15}>15 minutes</option>
          <option value={25}>25 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>60 minutes</option>
        </select>
      </div>

      <div className="focus-timer-display">
        {formattedTime}
      </div>

      <div className="focus-timer-buttons">
        {!timerRunning ? (
          <button onClick={handleStartTimer}>
            Start
          </button>
        ) : (
          <button onClick={handlePauseTimer}>
            Pause
          </button>
        )}

        <button onClick={handleResetTimer}>
          Reset
        </button>
      </div>

      <p className="focus-timer-status">
        {timerRunning
          ? "Stay focused. You've got this!"
          : timeLeft === 0
          ? "Focus session completed!"
          : "Ready when you are."}
      </p>
    </div>
    <div className="focus-history-card">
  <h2>Focus History</h2>

  {focusSessions.length === 0 ? (
    <p>No focus sessions yet. Complete your first session!</p>
  ) : (
    <div className="focus-history-list">
      {focusSessions
        .filter((session) => session.is_completed)
        .slice()
        .reverse()
        .map((session) => (
          <div className="focus-history-item" key={session.id}>
            <div>
              <h3>{session.title}</h3>
              <p>{session.session_date}</p>
            </div>

            <span>{session.duration_minutes} min</span>
          </div>
        ))}
    </div>
  )}
</div>
<div className="daily-goal-card">
  <h2>Daily Focus Goal</h2>
  <div className="daily-goal-selector">
  <label>Daily target:</label>

  <select
    value={dailyFocusGoal}
    onChange={(e) => setDailyFocusGoal(Number(e.target.value))}
  >
    <option value={60}>1 hour</option>
    <option value={120}>2 hours</option>
    <option value={180}>3 hours</option>
    <option value={240}>4 hours</option>
  </select>
</div>

  <div className="daily-goal-info">
    <h3>
      {Math.floor(todayFocusMinutes / 60)}h{" "}
      {todayFocusMinutes % 60}m
    </h3>
    <span>{Math.round(dailyGoalProgress)}% completed</span>
  </div>

  <div className="daily-goal-progress">
    <div
      className="daily-goal-progress-fill"
      style={{ width: `${dailyGoalProgress}%` }}
    ></div>
  </div>

  <p className="daily-goal-message">
    {todayFocusMinutes >= dailyFocusGoal
      ? "Amazing! You've achieved your daily focus goal."
      : `${dailyFocusGoal - todayFocusMinutes} minutes left to reach your goal.`}
  </p>
</div>
<div className="weekly-focus-card">
  <h2>Weekly Focus Analytics</h2>
  <p>Your daily focus time this week</p>

  <div style={{ width: "100%", height: 280 }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={weeklyFocusData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3552" />
        <XAxis dataKey="day" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#161b2e",
            border: "1px solid #2d3552",
            borderRadius: "10px",
            color: "#ffffff",
          }}
          formatter={(value) => [`${value} minutes`, "Focus Time"]}
        />
        <Area
          type="monotone"
          dataKey="minutes"
          stroke="#9270ff"
          fill="#9270ff"
          fillOpacity={0.2}
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>
    

  {!hasWeeklyFocus ? (
    <p>Complete some focus sessions to unlock your productivity insights!</p>
  ) : (
    <div className="insights-list">
      <div className="insight-item">
        <h3>Total Weekly Focus</h3>
        <p>
          {Math.floor(totalWeeklyFocusMinutes / 60)}h{" "}
          {totalWeeklyFocusMinutes % 60}m
        </p>
      </div>

      <div className="insight-item">
        <h3>Daily Average</h3>
        <p>{averageDailyFocusMinutes} minutes per day</p>
      </div>

      <div className="insight-item">
        <h3>Most Productive Day</h3>
        <p>
          {mostProductiveDay.day} — {mostProductiveDay.minutes} minutes
        </p>
      </div>
    </div>
  )}
</div>
    
) : activePage === "AI Insights" ? (
  <div className="page-container">
    <div className="page-header">
      <div>
        <h1>AI Insights</h1>
        <p>Understand your productivity with personalized AI analysis.</p>
      </div>
    </div>

    <div className="productivity-insights-card">
      <h2>✦ Your AI Productivity Analysis</h2>

      <button onClick={fetchAIInsights} disabled={aiLoading}>
        {aiLoading ? "Analyzing..." : "Generate AI Insights"}
      </button>

      {aiStatus === "success" && <p>{aiInsights}</p>}
      {aiStatus === "unavailable" && <p>{aiInsights}</p>}
    </div>
  </div>
) : activePage === "Settings" ? (
  <div className="page-container">
    <div className="page-header">
      <div>
        <h1>Settings</h1>
        <p>Manage your LifeLens preferences and account.</p>
      </div>
    </div>

    <div className="productivity-insights-card">
      <h2>Profile</h2>
      <p>Manage your personal account information.</p>

      {isEditingProfile ? (
        <>
          <div className="setting-row">
            <div>
              <h3>Full Name</h3>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className="setting-row">
            <div>
              <h3>Email Address</h3>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={!editName.trim() || !editEmail.trim()}
          >
            Save Changes
          </button>

          <button
            onClick={() => {
              setIsEditingProfile(false);
              setProfileMessage("");
            }}
          >
            Cancel
          </button>
                </>
      ) : (
        <div className="setting-row">
          <div className="avatar">
            {profile?.full_name?.charAt(0).toUpperCase() || "M"}
          </div>

          <div>
            <h3>{profile?.full_name || "My Account"}</h3>
            <p>{profile?.email || "No email available"}</p>
          </div>

          <button
            onClick={() => {
              setEditName(profile?.full_name || "");
              setEditEmail(profile?.email || "");
              setProfileMessage("");
              setIsEditingProfile(true);
            }}
          >
            Edit Profile
          </button>
        </div>
      )}

      {profileMessage && <p>{profileMessage}</p>}
    </div>
    <div className="productivity-insights-card">
  <h2>Appearance</h2>
  <p>Choose how LifeLens looks on your screen.</p>

  <div className="setting-row">
    <div>
      <h3>Theme</h3>
      <p>Select your preferred appearance.</p>
    </div>

    <div className="theme-toggle">
  <button
    className={theme === "dark" ? "theme-option active" : "theme-option"}
    onClick={() => setTheme("dark")}
  >
    <Moon size={16} />
    Dark
  </button>

  <button
    className={theme === "light" ? "theme-option active" : "theme-option"}
    onClick={() => setTheme("light")}
  >
    <Sun size={16} />
    Light
  </button>
</div>
  </div>
</div>
  </div>
) : (
  <>

          <div className="welcome-row">
            <div>
              <p className="date-label">SUNDAY, NOVEMBER 1</p>
              <h1>Good afternoon! <span>✦</span></h1>
              <p className="welcome-subtitle">
                Here's what's happening in your life today.
              </p>
            </div>

            <button
  className="add-button"
  onClick={() => setShowAddExpense(true)}
>
  <Plus size={18} />
  Add Entry
</button>
          </div>

          <div className="stats-grid">

          <div className="stat-card">
  <div className="stat-top">
    <span>Total Expenses</span>
    <div className="stat-icon purple">
      <Wallet size={19} />
    </div>
  </div>

  <h2>₹{totalExpenses.toLocaleString("en-IN")}</h2>

  <p className="positive">
    <ArrowDownRight size={15} />
    Actual spending
  </p>
</div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Productivity Score</span>
                <div className="stat-icon blue">
                  <Clock3 size={19} />
                </div>
              </div>
              <h2>86<span className="small-unit">/100</span></h2>
              <p className="positive">
                <ArrowUpRight size={15} />
                12.5% <span>vs last week</span>
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Habit Consistency</span>
                <div className="stat-icon pink">
                  <Target size={19} />
                </div>
              </div>
              <h2>78%</h2>
              <p className="positive">
                <ArrowUpRight size={15} />
                5.4% <span>vs last week</span>
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>AI Insights</span>
                <div className="stat-icon green">
                  <BrainCircuit size={19} />
                </div>
              </div>
              <h2>12</h2>
              <p className="neutral">
                <Sparkles size={15} />
                New insights available
              </p>
            </div>

          </div>

          <div className="charts-grid">

            <div className="panel activity-panel">
              <div className="panel-header">
                <div>
                  <h3>Weekly Overview</h3>
                  <p>Your activity and spending trends</p>
                </div>
                <button className="period-button">This week⌄</button>
              </div>

              <div className="chart-legend">
                <span><i className="legend-purple"></i> Spending</span>
              </div>

              <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient
                        id="purpleGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#9270ff" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#9270ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#292536"
                      vertical={false}
                      strokeDasharray="4 4"
                    />

                    <XAxis
                      dataKey="day"
                      stroke="#777386"
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      stroke="#777386"
                      tickLine={false}
                      axisLine={false}
                      width={45}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#211d2e",
                        border: "1px solid #393148",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="spending"
                      stroke="#9270ff"
                      strokeWidth={3}
                      fill="url(#purpleGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel expense-panel">
              <div className="panel-header">
                <div>
                  <h3>Expense Breakdown</h3>
                  <p>Where your money goes</p>
                </div>
                <button className="more-button">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="pie-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={88}
                      paddingAngle={5}
                      stroke="none"
                    >
                      {expenseData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#211d2e",
                        border: "1px solid #393148",
                        borderRadius: "10px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-center">
                  <strong>₹12.4k</strong>
                  <span>Total</span>
                </div>
              </div>

              <div className="expense-legend">
                {expenseData.map((item) => (
                  <div className="expense-item" key={item.name}>
                    <span>
                      <i style={{ background: item.color }}></i>
                      {item.name}
                    </span>
                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="bottom-grid">

            <div className="panel insights-panel">
              <div className="panel-header">
                <div className="insight-title">
                  <div className="insight-icon">
                    <Sparkles size={19} />
                  </div>
                  <div>
                    <h3>AI Insights</h3>
                    <p>Personalized observations</p>
                  </div>
                </div>
                <span className="new-badge">NEW</span>
              </div>

              <div className="insight-box">
                <h4>Your spending pattern changed!</h4>
                <p>
                  Your weekend spending is higher than your weekday
                  average. Reviewing your shopping expenses could
                  help you manage your budget.
                </p>
                <button className="text-button">
                  Explore insights <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="insight-box second-insight">
                <h4>You're building consistency!</h4>
                <p>
                  Your habit consistency score has improved
                  compared to last week.
                </p>
              </div>
            </div>

            <div className="panel activity-list">
              <div className="panel-header">
                <div>
                  <h3>Recent Activity</h3>
                  <p>Your latest entries</p>
                </div>
                <button className="text-button">View all</button>
              </div>

              {expenses.slice(0, 3).map((expense) => (
  <div className="activity-item" key={expense.id}>
    <div className="activity-icon purple">
      <Wallet size={18} />
    </div>

    <div className="activity-description">
      <h4>{expense.title}</h4>
      <p>
        {expense.category} •{" "}
        {new Date(expense.date + "T00:00:00").toLocaleDateString("en-IN")}
        {expense.payment_method && ` • ${expense.payment_method}`}
      </p>
    </div>

    <strong>-₹{Number(expense.amount).toLocaleString("en-IN")}</strong>
  </div>
))}
              <div className="activity-item">
                <div className="activity-icon pink">
                  <Target size={18} />
                </div>
                <div className="activity-description">
                  <h4>Morning workout</h4>
                  <p>Today, 7:30 AM</p>
                </div>
                <strong className="completed">Done</strong>
              </div>
            </div>

          </div>

          <footer>
            LifeLens © 2026 · Understand your patterns. Make smarter decisions.
          </footer>
          </>
  )}
      </section>
      </main>
    </div>
  );
}

export default App;
