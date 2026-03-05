import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Menu, X, Shield, MapPin, Map, Trophy, Sparkles } from 'lucide-react'
import { useState } from 'react'
import NotificationsDropdown from './NotificationsDropdown'
import { useAuthSync } from '../hooks/useIssues'

export default function Navbar() {
    useAuthSync()
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    return (
        <nav className="nav-shell">
            <div className="nav-inner">
                {/* Logo */}
                <Link to="/" className="nav-brand">
                    <span className="nav-logo">
                        <MapPin className="w-5 h-5" />
                    </span>
                    <span className="nav-title">PublicRes</span>
                </Link>

                {/* Desktop nav */}
                <div className="nav-links">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/map"
                        className={`nav-link ${isActive('/map') ? 'active' : ''}`}
                    >
                        <Map className="w-3.5 h-3.5" />
                        Map
                    </Link>
                    <Link
                        to="/leaderboard"
                        className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
                    >
                        <Trophy className="w-3.5 h-3.5" />
                        Leaderboard
                    </Link>
                    <Link
                        to="/report"
                        className={`nav-link accent ${isActive('/report') ? 'active' : ''}`}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Insights
                    </Link>
                    <SignedIn>
                        <Link
                            to="/dashboard"
                            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                        >
                            My Reports
                        </Link>
                        <Link
                            to="/profile"
                            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
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

                {/* Mobile menu button */}
                <button
                    className="nav-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="nav-panel">
                    <Link
                        to="/"
                        className="nav-panel__link"
                        onClick={() => setMobileOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/map"
                        className="nav-panel__link"
                        onClick={() => setMobileOpen(false)}
                    >
                        🗺️ Map Explorer
                    </Link>
                    <Link
                        to="/leaderboard"
                        className="nav-panel__link"
                        onClick={() => setMobileOpen(false)}
                    >
                        🏆 Leaderboard
                    </Link>
                    <Link
                        to="/report"
                        onClick={() => setMobileOpen(false)}
                        className="nav-panel__link accent"
                    >
                        ✨ AI Locality Insights
                    </Link>
                    <SignedIn>
                        <Link
                            to="/dashboard"
                            className="nav-panel__link"
                            onClick={() => setMobileOpen(false)}
                        >
                            My Reports
                        </Link>
                        <Link
                            to="/profile"
                            className="nav-panel__link"
                            onClick={() => setMobileOpen(false)}
                        >
                            Profile
                        </Link>
                        <div className="nav-panel__user">
                            <UserButton />
                        </div>
                    </SignedIn>
                    <SignedOut>
                        <div className="nav-panel__user">
                            <SignInButton mode="modal">
                                <button className="btn-primary text-sm w-full">Sign In</button>
                            </SignInButton>
                        </div>
                    </SignedOut>
                </div>
            )}
        </nav>
    )
}
