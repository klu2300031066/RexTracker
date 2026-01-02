import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useStreak from '../hooks/useStreak';
import StreakCard from './StreakCard';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import './TodoList.css';

const TodoList = () => {
    const [tasks, setTasks] = useLocalStorage('rex_tasks', []);
    const [newTask, setNewTask] = useState('');
    const { streak, updateStreak } = useStreak('rex_streak_task');

    const addTask = () => {
        if (!newTask.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
        setNewTask('');
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                const newCompletedStatus = !task.completed;
                // If marking as complete, update streak
                if (newCompletedStatus) {
                    updateStreak();
                }
                return {
                    ...task,
                    completed: newCompletedStatus,
                    completedAt: newCompletedStatus ? Date.now() : null
                };
            }
            return task;
        }));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') addTask();
    };

    return (
        <div className="todo-widget">
            <div className="widget-header">
                <h3>My Tasks</h3>
            </div>

            <div className="add-task-row">
                <input
                    id="todo-input"
                    type="text"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={addTask} className="add-btn">
                    <Plus size={20} />
                </button>
            </div>

            <div className="task-list">
                {tasks.length === 0 && <div className="empty-state">No tasks for today!</div>}

                {tasks.map(task => (
                    <div key={task.id} className={`task - item ${task.completed ? 'completed' : ''} `}>
                        <button onClick={() => toggleTask(task.id)} className="check-btn">
                            {task.completed ? <CheckCircle size={20} color="#10b981" /> : <Circle size={20} />}
                        </button>
                        <span className="task-text">{task.text}</span>
                        <button onClick={() => deleteTask(task.id)} className="delete-btn">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <StreakCard streak={streak} label="Task Streak" />
            </div>
        </div>
    );
};

export default TodoList;
