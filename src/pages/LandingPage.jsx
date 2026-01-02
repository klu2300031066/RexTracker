import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();
    const { userName, setUserName } = useUser();
    const [inputValue, setInputValue] = useState(userName);

    const handleEnter = () => {
        if (!inputValue.trim()) {
            alert("Please enter a name to continue");
            return;
        }
        setUserName(inputValue);
        navigate('/dashboard');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleEnter();
    };

    return (
        <div className="landing-page">
            <div className="welcome-text">Welcome to</div>
            <h1 className="hero-title">REX</h1>
            <p className="sub-headline">Let&apos;s do it.</p>

            <div className="input-group">
                <input
                    type="text"
                    className="name-input"
                    placeholder="Enter your name..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button className="enter-btn" onClick={handleEnter}>
                    ENTER
                </button>
            </div>
        </div>
    )
}

export default LandingPage;
