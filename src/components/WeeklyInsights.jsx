import { useMemo, useState, useEffect } from 'react';
import { BarChart2, Clock, CheckSquare, Zap, TrendingUp, Calendar } from 'lucide-react';
import './WeeklyInsights.css';

const WeeklyInsights = () => {
    // We read directly from localStorage here to get a snapshot
    // In a real app with Context, we'd use that. 
    // This component assumes it re-renders or mounts when data might have changed, 
    // or we can treat it as a "report" that updates on refresh/mount.

    const getStorageData = (key) => {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    };

    const [tick, setTick] = useState(0);

    // Listen for custom storage updates to trigger re-render
    useEffect(() => {
        const handleStorageChange = () => setTick(t => t + 1);
        window.addEventListener('rex-storage-update', handleStorageChange);
        return () => window.removeEventListener('rex-storage-update', handleStorageChange);
    }, []);

    const stats = useMemo(() => {
        const tasks = getStorageData('rex_tasks');
        const sessions = getStorageData('rex_study_sessions');
        const expenses = getStorageData('rex_expenses');

        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);

        // Filter for this week
        const weeklyTasks = tasks.filter(t => t.completedAt && new Date(t.completedAt) >= startOfWeek);
        const weeklySessions = sessions.filter(s => new Date(s.date) >= startOfWeek);
        // Expenses might rely on `id` as timestamp or `date` string. Using safe parsing from before.
        const weeklyExpenses = expenses.filter(e => {
            const d = e.id ? new Date(e.id) : new Date(e.date);
            return d >= startOfWeek;
        });

        // Metrics
        const tasksCompleted = weeklyTasks.length;
        const sessionsCompleted = weeklySessions.length;
        const focusMinutes = weeklySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
        const totalSpent = weeklyExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

        return { tasksCompleted, sessionsCompleted, focusMinutes, totalSpent };
    }, [tick]); // eslint-disable-line react-hooks/exhaustive-deps

    // Helper to format minutes to HM
    const formatFocusTime = (mins) => {
        if (mins < 60) return `${mins}m`;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}h ${m}m`;
    };

    return (
        <div className="weekly-insights">
            <h2><BarChart2 size={20} /> Weekly Review</h2>
            <div className="insights-grid">
                <div className="insight-card">
                    <Clock size={20} className="insight-icon" />
                    <span className="insight-value">{formatFocusTime(stats.focusMinutes)}</span>
                    <span className="insight-label">Focus Time</span>
                </div>

                <div className="insight-card">
                    <CheckSquare size={20} className="insight-icon" />
                    <span className="insight-value">{stats.tasksCompleted}</span>
                    <span className="insight-label">Tasks Done</span>
                </div>

                <div className="insight-card">
                    <span className="insight-icon" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹</span>
                    <span className="insight-value">₹{stats.totalSpent.toFixed(0)}</span>
                    <span className="insight-label">Spent</span>
                </div>
            </div>
        </div>
    );
};

export default WeeklyInsights;
