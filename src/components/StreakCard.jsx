import { Trophy, Flame } from 'lucide-react';

import './StreakCard.css';

const StreakCard = ({ streak, label = "Current Streak" }) => {

    const getMessage = (count) => {
        if (count === 0) return "Start your journey today!";
        if (count < 3) return "Consistency starts now.";
        if (count < 7) return "You're on fire! Keep it up.";
        if (count < 14) return "Unstoppable momentum!";
        return "Legendary consistency!";
    };

    const isHot = streak >= 3;

    return (
        <div className={`streak-card ${isHot ? 'streak-hot' : ''}`}>
            <div className="streak-icon-wrapper">
                <Flame size={20} className={isHot ? "animate-pulse" : ""} fill={isHot ? "currentColor" : "none"} />
            </div>
            <div className="streak-content">
                <div className="streak-count">
                    {streak} Day{streak !== 1 ? 's' : ''}
                </div>

                <div className="streak-message">{getMessage(streak)}</div>
            </div>
        </div>
    );
};

export default StreakCard;
