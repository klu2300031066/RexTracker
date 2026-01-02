import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import './StudyTimer.css';

const StudyTimer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [durationInput, setDurationInput] = useState(25);
    const timerRef = useRef(null);
    const [sessions, setSessions] = useLocalStorage('rex_study_sessions', []);

    const totalTime = isBreak ? 5 * 60 : durationInput * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    // Circle Config
    const radius = 80;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timerRef.current);
            setIsActive(false);
            if (!isBreak) {
                // Focus session completed!
                const newSession = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    duration: durationInput
                };
                setSessions(prev => [...prev, newSession]);

                setIsBreak(true);
                setTimeLeft(5 * 60);
            } else {
                setIsBreak(false);
                setTimeLeft(durationInput * 60);
            }
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft, isBreak, durationInput, setSessions]);

    // Sync active state to localStorage for the Bot
    useEffect(() => {
        localStorage.setItem('rex_timer_active', JSON.stringify(isActive));
        window.dispatchEvent(new Event('rex-storage-update'));
    }, [isActive]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setTimeLeft(durationInput * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="study-timer-hero" id="study-timer-widget">
            <div className={`timer-circle-container ${isActive ? 'pulsing' : ''}`}>
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="timer-svg"
                >
                    <circle
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke={isBreak ? '#4ade80' : '#818cf8'}
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="progress-ring"
                    />
                </svg>
                <div className="timer-text">
                    <span className="time-value">{formatTime(timeLeft)}</span>
                    <span className="timer-label">
                        {isBreak ? <><Coffee size={14} /> Break</> : <><Zap size={14} /> Focus</>}
                    </span>
                </div>
            </div>

            <div className="hero-controls">
                <button
                    className={`hero-btn main-action ${isActive ? 'active' : ''}`}
                    onClick={toggleTimer}
                    id="study-timer-start-btn"
                >
                    {isActive ? "Pause" : "Start Focus"}
                </button>
                <button className="hero-btn secondary" onClick={resetTimer} title="Reset">
                    <RotateCcw size={20} />
                </button>
            </div>

            {!isActive && !isBreak && (
                <div className="hero-settings">
                    <label>Session Length</label>
                    <input
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        value={durationInput}
                        onChange={(e) => {
                            setDurationInput(Number(e.target.value));
                            setTimeLeft(Number(e.target.value) * 60);
                        }}
                    />
                    <span>{durationInput} min</span>
                </div>
            )}
        </div>
    );
};

export default StudyTimer;
