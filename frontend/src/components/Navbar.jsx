import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Menu, X, Shield, MapPin, Map, Trophy, Sparkles, Home, User } from 'lucide-react'
import NotificationsDropdown from './NotificationsDropdown'
import { useAuthSync } from '../hooks/useIssues'

export default function Navbar() {
    useAuthSync()
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    return (
        <>
            <nav className="nav-shell">
                <div className="nav-inner">
                    {/* Logo */}
                    <Link to="/" className="nav-brand">
                        <span className="nav-logo">
                            <img src="/logo.png" alt="Namma Parihara" className="w-6 h-6" />
                        </span>
                        <span className="nav-title">Namma Parihara</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="nav-links">
                        <Link
                            to="/"
                            className={`nav-link ${isActive('/') ? 'active' : ''} `}
                        >
                            Home
                        </Link>
                        <Link
                            to="/map"
                            className={`nav-link ${isActive('/map') ? 'active' : ''} `}
                        >
                            <Map className="w-3.5 h-3.5" />
                            Map
                        </Link>
                        <Link
                            to="/leaderboard"
                            className={`nav-link ${isActive('/leaderboard') ? 'active' : ''} `}
                        >
                            <Trophy className="w-3.5 h-3.5" />
                            Leaderboard
                        </Link>
                        <Link
                            to="/report"
                            className={`nav-link accent ${isActive('/report') ? 'active' : ''} `}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Insights
                        </Link>
                        <SignedIn>
                            <Link
                                to="/dashboard"
                                className={`nav-link ${isActive('/dashboard') ? 'active' : ''} `}
                            >
                                My Reports
                            </Link>
                            <Link
                                to="/profile"
                                className={`nav-link ${isActive('/profile') ? 'active' : ''} `}
                            >
                                <Shield className="w-3.5 h-3.5" />
                                Profile
                            </Link>
                        </SignedIn>
                    </div>

                    {/* Auth */}
                    <div className="nav-actions">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="btn-primary text-sm">Sign In</button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <div className="nav-user">
                                <NotificationsDropdown />
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: 'w-9 h-9 ring-2 ring-ember-500/40',
                                        },
                                    }}
                                />
                            </div>
                        </SignedIn>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation (Floating) */}
            <nav className="mobile-nav">
                <div className="mobile-nav-inner">
                    <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
                        <Home className="w-5 h-5" />
                        <span className="mobile-nav-label">Home</span>
                    </Link>
                    <Link to="/map" className={`mobile-nav-item ${isActive('/map') ? 'active' : ''}`}>
                        <Map className="w-5 h-5" />
                        <span className="mobile-nav-label">Map</span>
                    </Link>

                    {/* Floating Action Button for Reporting */}
                    <Link to="/report" className="mobile-nav-fab">
                        <div className="fab-inner">
                            <Sparkles className="w-6 h-6" />
                        </div>
                    </Link>

                    <Link to="/leaderboard" className={`mobile-nav-item ${isActive('/leaderboard') ? 'active' : ''}`}>
                        <Trophy className="w-5 h-5" />
                        <span className="mobile-nav-label">Rank</span>
                    </Link>

                    <SignedIn>
                        <Link to="/profile" className={`mobile-nav-item ${isActive('/profile') ? 'active' : ''}`}>
                            <Shield className="w-5 h-5" />
                            <span className="mobile-nav-label">Profile</span>
                        </Link>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="mobile-nav-item sign-in-btn">
                                <User className="w-5 h-5" />
                                <span className="mobile-nav-label">Login</span>
                            </button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </nav>
        </>
    )
}
