import { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';
import './Clock.css';

const Clock = ({ weeklyTotal }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    };

    return (
        <div className="clock-widget">
            <div className="clock-header">
                <ClockIcon size={20} className="clock-icon" />
                <h3>Current Time</h3>
            </div>
            <div className="clock-display">
                <div className="time">
                    {formatTime(time)}
                    {typeof weeklyTotal === 'number' && (
                        <span className="weekly-total-inline" style={{ display: 'block', fontSize: '0.4em', opacity: 0.7, marginTop: '5px' }}>
                            Week: ₹{weeklyTotal.toFixed(2)}
                        </span>
                    )}
                </div>
                <div className="date">{formatDate(time)}</div>
            </div>
        </div>
    );
};

export default Clock;
