import { Play, Plus, Receipt } from 'lucide-react';

import './QuickActions.css';

const QuickActions = () => {

    const handleAction = (type) => {
        if (type === 'focus') {
            const timerWidget = document.getElementById('study-timer-widget');
            const startBtn = document.getElementById('study-timer-start-btn');
            if (timerWidget) {
                timerWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });

            }
        } else if (type === 'task') {
            const taskInput = document.getElementById('todo-input');
            if (taskInput) {
                taskInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => taskInput.focus(), 500);
            }
        } else if (type === 'expense') {
            // We need to add an id to the expense input first in ExpenseTracker.jsx
            // Assuming we will add id="expense-input-amount"
            const expenseInput = document.getElementById('expense-input-amount');
            if (expenseInput) {
                expenseInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => expenseInput.focus(), 500);
            }
        }
    };

    return (
        <div className="quick-actions-bar">
            <button className="quick-action-btn primary" onClick={() => handleAction('focus')}>
                <Play size={16} fill="white" />
                <span>Start Focus</span>
            </button>

            <div className="action-divider"></div>

            <button className="quick-action-btn" onClick={() => handleAction('task')}>
                <Plus size={18} />
                <span>Add Task</span>
            </button>

            <button className="quick-action-btn" onClick={() => handleAction('expense')}>
                <Receipt size={18} />
                <span>Log Expense</span>
            </button>
        </div>
    );
};

export default QuickActions;
