import React from 'react';
import { Bot, Sparkles, AlertCircle, Coffee } from 'lucide-react';
import useInsightBot from '../hooks/useInsightBot';
import './InsightBot.css';

const InsightBot = () => {
    const { message, mood } = useInsightBot();

    // Icon & Color mapping based on mood
    const getMoodConfig = () => {
        switch (mood) {
            case 'excited':
                return { icon: <Sparkles size={20} />, color: 'var(--accent-color, #70a1ff)' };
            case 'concerned':
                return { icon: <AlertCircle size={20} />, color: '#ff6b6b' }; // Red-ish
            case 'happy':
                return { icon: <Bot size={20} />, color: '#1dd1a1' }; // Green-ish
            default:
                return { icon: <Coffee size={20} />, color: '#a4b0be' }; // Gray-ish
        }
    };

    const { icon, color } = getMoodConfig();

    return (
        <div className={`insight-bot-card mood-${mood}`}>
            <div className="bot-avatar" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="bot-message-container">
                <p className="bot-message">{message}</p>
            </div>
        </div>
    );
};

export default InsightBot;
