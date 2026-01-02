import { useState, useEffect } from 'react';

const MESSAGE_BANK = {
    late_night: [
        "It's getting late... sleep is the best productivity hack! 😴",
        "Still up? Your brain needs recharge time for tomorrow. 🌙",
        " burning the midnight oil? Don't forget to rest. 🦉",
        "Go to bed! The work will still be there tomorrow. 💤",
        "Late night inspiration is great, but sleep is better. 🛌"
    ],
    early_morning: [
        "Good morning! Ready to conquer the day? ☀️",
        "Rise and shine! What's the main goal today? ☕",
        "Early bird gets the worm (and the tasks done)! 🐦",
        "Fresh start! Let's make today count. 🌅"
    ],
    high_expense: [
        (amount) => `Whoa, spent ₹${amount} today. Wallet feeling light? 💸`,
        (amount) => `Big spending day (₹${amount})! Maybe save a bit tomorrow? 💰`,
        "Retail therapy? Just keep an eye on the budget! 🛍️",
        "Money moves fast today! checking the brakes? 📉"
    ],
    moderate_expense: [
        (amount) => `Noted: ₹${amount} spent today. 📝`,
        "Tracking every penny is the first step to wealth! 💎",
        (amount) => `Budget update: ₹${amount} used so far. 📊`,
        "Smart spending is as important as earning. 💡"
    ],
    streak_celebration: [
        (days) => `${days} day streak! You're unstoppable! 🔥`,
        (days) => `Consistency is key! ${days} days in a row! 🗓️`,
        (days) => `Wow, ${days} day streak. Keep this momentum! 🚀`,
        "Building habits like a pro! 🧱"
    ],
    high_productivity: [
        "You're on fire today! 🔥",
        "Productivity level: 1000! Keep it up. 🚀",
        "Look at you go! crushing tasks left and right. 💪",
        "In the zone! Don't forget to drink water though. 💧",
        "Efficiency mode: ON. You're doing great! ⭐"
    ],
    steady_progress: [
        (tasks) => `Nice pace! ${tasks} tasks down. clear and steady. 👍`,
        (mins) => `Solid work! ${mins} minutes of focus today. 🧠`,
        "Chipping away at it. Progress is progress! 🔨",
        "You're doing well. Keep that momentum going. 🎢"
    ],
    slump: [
        "Post-lunch slump? Maybe a quick 5-min task to start? ☕",
        "Feeling stuck? stretch your legs and come back fresh! 🧘",
        "Energy low? A quick walk might fix that. 🚶",
        "Just one small task. You got this. 🌱"
    ],
    focusing: [
        "Shhh... deep work in progress! 🤫",
        "You're doing great! Stay focused. 🧠",
        "Lock in! Distractions can wait. 🚫",
        "Learning mode: ON. 📚",
        "Keep going, future you will thank you! ⏳"
    ],
    idle: [
        "Quiet day? That's okay, rest is productive too. 🍃",
        "Ready when you are! Let's get something done. ⚡",
        "Tip: Start with the smallest task to get rolling. 🎲",
        "Blank slate. What's the first move? ♟️"
    ]
};

const useInsightBot = () => {
    const [message, setMessage] = useState("Hello! Ready for a productive day? 👋");
    const [mood, setMood] = useState('neutral');

    // Helper to pick random message
    const pickVideo = (category, param) => {
        const options = MESSAGE_BANK[category];
        const choice = options[Math.floor(Math.random() * options.length)];
        return typeof choice === 'function' ? choice(param) : choice;
    };

    useEffect(() => {
        const analyzeUserBehavior = () => {
            const now = new Date();
            const hour = now.getHours();

            // 1. Fetch Data
            const tasks = JSON.parse(localStorage.getItem('rex_tasks') || '[]');
            const sessions = JSON.parse(localStorage.getItem('rex_study_sessions') || '[]');
            const expenses = JSON.parse(localStorage.getItem('rex_expenses') || '[]');
            const isTimerActive = JSON.parse(localStorage.getItem('rex_timer_active') || 'false');
            const streakData = JSON.parse(localStorage.getItem('rex_streak_task') || '{"streak": 0}');
            const streak = streakData.streak || 0;

            // 2. Filter for TODAY
            const todayStr = now.toDateString();

            const tasksToday = tasks.filter(t =>
                t.completed && t.completedAt && new Date(t.completedAt).toDateString() === todayStr
            );
            const sessionsToday = sessions.filter(s =>
                new Date(s.date).toDateString() === todayStr
            );
            const expensesToday = expenses.filter(e => {
                const d = e.id ? new Date(e.id) : new Date(e.date);
                return d.toDateString() === todayStr;
            });

            // 3. Metrics
            const taskCount = tasksToday.length;
            const focusMinutes = sessionsToday.reduce((acc, s) => acc + (s.duration || 0), 0);
            const expenseTotal = expensesToday.reduce((acc, e) => acc + (e.amount || 0), 0);

            // 4. Logic Tree
            let category = 'idle';
            let param = null;
            let newMood = 'neutral';

            // Timer Active (Immediate Focus Mode)
            if (isTimerActive) {
                category = 'focusing';
                newMood = 'excited';
            }
            // Sleep Check (Highest Priority)
            else if (hour >= 23 || hour < 5) {
                category = 'late_night';
                newMood = 'concerned';
            }
            // High Expense Alert
            else if (expenseTotal > 2000) {
                category = 'high_expense';
                param = expenseTotal.toFixed(0);
                newMood = 'concerned';
            }
            // High Productivity "The Zone"
            else if (taskCount >= 5 || focusMinutes >= 120) {
                category = 'high_productivity';
                newMood = 'excited';
            }
            // Streak Celebration (3+ days) - High priority but below "The Zone"
            else if (streak >= 3 && taskCount > 0 && Math.random() > 0.7) {
                // Random chance to show streak msg so it's not ALWAYS streak msg if you have a streak
                category = 'streak_celebration';
                param = streak;
                param = streak;
                newMood = 'excited';
            }
            // Moderate Spending (Prioritized but randomized so it doesn't block others)
            // 40% chance to show expense msg if > 0
            else if (expenseTotal > 0 && Math.random() > 0.6) {
                category = 'moderate_expense';
                param = expenseTotal.toFixed(0);
                newMood = 'neutral';
            }
            // Morning Start
            else if (hour >= 6 && hour < 10 && taskCount === 0 && focusMinutes === 0) {
                category = 'early_morning';
                newMood = 'happy';
            }
            // Mid-day Slump check (Afternoon, low activity)
            else if (hour >= 13 && hour < 16 && focusMinutes < 30 && taskCount < 2) {
                category = 'slump';
                newMood = 'neutral';
            }
            // Steady Progress
            else if (taskCount > 0 || focusMinutes > 0) {
                category = 'steady_progress';
                param = taskCount > 0 ? taskCount : focusMinutes;
                newMood = 'happy';
            }
            // Default Idle
            // Default Idle
            else {
                category = 'idle';
                newMood = 'neutral';
            }

            setMessage(pickVideo(category, param));
            setMood(newMood);
        };

        analyzeUserBehavior();
        const interval = setInterval(analyzeUserBehavior, 10000); // 10 Seconds
        const handleStorageUpdate = () => analyzeUserBehavior();
        window.addEventListener('rex-storage-update', handleStorageUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener('rex-storage-update', handleStorageUpdate);
        };
    }, []);

    return { message, mood };
};

export default useInsightBot;
