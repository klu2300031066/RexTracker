import { useUser } from '../context/UserContext';
import TodoList from '../components/TodoList';
import { getFormattedDate } from '../utils/dateutils';
import Clock from '../components/Clock';
import StudyTimer from '../components/StudyTimer';
import ExpenseTracker from '../components/ExpenseTracker';
import WeeklyInsights from '../components/WeeklyInsights';
import InsightBot from '../components/InsightBot';
import QuickActions from '../components/QuickActions';
import useLocalStorage from '../hooks/useLocalStorage';
import './DashboardHome.css';

const DashboardHome = () => {
    const { userName } = useUser();
    const [expenses, setExpenses] = useLocalStorage('rex_expenses', []);

    // Calculate weekly total
    const getWeeklyTotal = () => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);

        return expenses
            .filter(expense => {
                // Use expense.id (timestamp) if available for accurate date, fallback to date string
                const expenseDate = expense.id ? new Date(expense.id) : new Date(expense.date);
                return expenseDate >= startOfWeek;
            })
            .reduce((acc, curr) => acc + curr.amount, 0);
    };

    const weeklyTotal = getWeeklyTotal();

    return (
        <div className="dashboard-home">
            <InsightBot />
            <WeeklyInsights />

            <div className="dashboard-grid">
                {/* 1. Clock Widget */}
                <div className="grid-item clock-section">
                    <Clock weeklyTotal={weeklyTotal} />
                </div>

                {/* 2. Todo List */}
                <div className="grid-item todo-section">
                    <TodoList />
                </div>

                {/* 3. Study Timer (Replaces Notes) */}
                <div className="grid-item timer-section">
                    <StudyTimer />
                </div>

                {/* 4. Expense Tracker (Last) */}
                <div className="grid-item expense-section">
                    <ExpenseTracker expenses={expenses} setExpenses={setExpenses} />
                </div>
            </div>

            <QuickActions />
        </div>
    );
};


export default DashboardHome;
