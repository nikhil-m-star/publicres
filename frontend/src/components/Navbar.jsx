import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Menu, X, Shield, MapPin, Map, Trophy, Sparkles, Home, User, Plus, FileText, Users, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import NotificationsDropdown from './NotificationsDropdown'
import { useAuthSync } from '../hooks/useIssues'

export default function Navbar() {
    useAuthSync()
    const location = useLocation()
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollY = useRef(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (window.innerWidth <= 900) {
                if (currentScrollY > lastScrollY.current + 5 && currentScrollY > 60) {
                    setIsVisible(false)
                } else if (currentScrollY < lastScrollY.current - 5) {
                    setIsVisible(true)
                }
            } else {
                setIsVisible(true)
            }
            lastScrollY.current = currentScrollY
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isActive = (path) => location.pathname === path

    return (
        <div className={`nav-unified-container ${!isVisible ? 'nav-hidden' : ''}`}>
            {/* Main Navigation Pill */}
            <nav className="nav-unified glass">
                <div className="nav-unified__inner">
                    {/* Brand - Integrated for all views */}
                    <Link to="/" className="nav-unified__brand">
                        <img src="/logo.png" alt="Namma Parihara" className="nav-unified__logo" />
                        <span className="nav-unified__title">Namma Parihara</span>
                    </Link>

                    {/* Navigation Items */}
                    <div className="nav-unified__links">
                        <Link to="/" className={`nav-unified__link ${isActive('/') ? 'active' : ''}`}>
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <Link to="/map" className={`nav-unified__link ${isActive('/map') ? 'active' : ''}`}>
                            <Map className="w-4 h-4" />
                            <span>Map</span>
                        </Link>
                        
                        {/* Dropdown Menu for Reports */}
                        <div className="nav-unified__dropdown-container">
                            <button className={`nav-unified__link ${(isActive('/submit') || isActive('/community')) ? 'active' : ''}`}>
                                <FileText className="w-4 h-4" />
                                <span>Reports</span>
                                <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
                            </button>
                            <div className="nav-unified__dropdown-menu">
                                <Link to="/submit" className="nav-unified__dropdown-item">
                                    <Plus className="w-4 h-4" />
                                    Report Issue
                                </Link>
                                <Link to="/community" className="nav-unified__dropdown-item">
                                    <Users className="w-4 h-4" />
                                    Community Reports
                                </Link>
                            </div>
                        </div>

                        <Link to="/report" className={`nav-unified__link ${isActive('/report') ? 'active' : ''}`}>
                            <Sparkles className="w-4 h-4" />
                            <span>AI Report</span>
                        </Link>

                        <Link to="/leaderboard" className={`nav-unified__link ${isActive('/leaderboard') ? 'active' : ''}`}>
                            <Trophy className="w-4 h-4" />
                            <span>Rank</span>
                        </Link>

                        <SignedIn>
                            <Link to="/profile" className={`nav-unified__link ${isActive('/profile') ? 'active' : ''}`}>
                                <Shield className="w-4 h-4" />
                                <span>Profile</span>
                            </Link>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal" forceRedirectUrl="/profile">
                                <button className="nav-unified__link auth-btn">
                                    <User className="w-4 h-4" />
                                    <span>Login</span>
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>

                    {/* Actions & User */}
                    <div className="nav-unified__actions">
                        <SignedIn>
                            <NotificationsDropdown />
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: 'w-8 h-8 ring-1 ring-white/10',
                                    },
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>

                {/* Mobile Status Overlay */}
                <div className="nav-unified__status-overlay">
                    <div className="status-indicator">
                        <div className="status-dot" />
                        <span>System Live</span>
                    </div>
                </div>
            </nav>
        </div>
    )
}

