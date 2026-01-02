import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
    LayoutDashboard,
    LogOut,
    Search,
    User,
    ChevronLeft,
    ChevronRight,
    PanelLeft,
    ArrowLeft,
    Info
} from 'lucide-react';
import './DashboardLayout.css';
import AboutModal from '../components/AboutModal';

const Sidebar = ({ isOpen, onOpenAbout }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <div className="logo-icon">
                    ⚡
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-item active">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </div>

                <div className="nav-item" onClick={onOpenAbout} style={{ cursor: 'pointer' }}>
                    <Info size={20} />
                    <span>About Us</span>
                </div>

                {/* Placeholder for future links */}
                <div className="nav-spacer"></div>
            </nav>
        </aside>
    );
};

const Header = () => {
    const { userName } = useUser();
    const navigate = useNavigate();

    return (
        <header className="dashboard-header">
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            <div className="user-profile">
                <button
                    className="back-home-btn"
                    onClick={() => navigate('/')}
                    title="Back to Home"
                    style={{ marginRight: '10px' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="user-info">
                    <span className="user-name">{userName}</span>
                    <span className="user-role">User</span>
                </div>
                <div className="avatar">
                    <User size={24} />
                </div>
            </div>
        </header>
    );
};

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-layout">
            <div className="bg-glow"></div>

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

            <Sidebar isOpen={isSidebarOpen} onOpenAbout={() => setIsAboutOpen(true)} />

            {/* Float Toggle Button separately or overlapping */}
            <button
                className={`sidebar-toggle ${isSidebarOpen ? 'open' : 'closed'}`}
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
            >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            <main className={`dashboard-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Header />
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
