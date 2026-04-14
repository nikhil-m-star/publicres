import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Menu, X, Shield, MapPin, Map, Trophy, Sparkles, Home, User, Plus, FileText, Users, ChevronDown, MoreHorizontal } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import NotificationsDropdown from './NotificationsDropdown'
import { useAuthSync } from '../hooks/useIssues'

export default function Navbar() {
    useAuthSync()
    const location = useLocation()
    const [isVisible, setIsVisible] = useState(true)
    const [openDropdown, setOpenDropdown] = useState(null)
    const lastScrollY = useRef(0)
    const navRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenDropdown(null)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const toggleDropdown = (e, name) => {
        e.preventDefault()
        e.stopPropagation()
        setOpenDropdown(openDropdown === name ? null : name)
    }

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

    // Close any open dropdowns when clicking a route 
    useEffect(() => {
        setOpenDropdown(null)
    }, [location.pathname])

    const isActive = (path) => location.pathname === path

    return (
        <div className={`nav-unified-container ${!isVisible ? 'nav-hidden' : ''}`} ref={navRef}>
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
                        <div className={`nav-unified__dropdown-container ${openDropdown === 'reports' ? 'active-dropdown' : ''}`}
                            onMouseEnter={() => window.innerWidth > 900 && setOpenDropdown('reports')}
                            onMouseLeave={() => window.innerWidth > 900 && setOpenDropdown(null)}
                        >
                            <button
                                onClick={(e) => toggleDropdown(e, 'reports')}
                                className={`nav-unified__link ${(isActive('/submit') || isActive('/community')) ? 'active' : ''}`}
                            >
                                <FileText className="w-4 h-4" />
                                <span>Reports</span>
                                <ChevronDown className={`w-3 h-3 ml-1 opacity-60 transition-transform ${openDropdown === 'reports' ? 'rotate-180' : ''}`} />
                            </button>
                            <div className="nav-unified__dropdown-menu">
                                <Link to="/submit" className="nav-unified__dropdown-item" onClick={() => setOpenDropdown(null)}>
                                    <Plus className="w-4 h-4" />
                                    Report Issue
                                </Link>
                                <Link to="/community" className="nav-unified__dropdown-item" onClick={() => setOpenDropdown(null)}>
                                    <Users className="w-4 h-4" />
                                    Community Reports
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-1">
                            <Link to="/report" className={`nav-unified__link ${isActive('/report') ? 'active' : ''}`}>
                                <Sparkles className="w-4 h-4" />
                                <span>AI Report</span>
                            </Link>

                            <Link to="/leaderboard" className={`nav-unified__link ${isActive('/leaderboard') ? 'active' : ''}`}>
                                <Trophy className="w-4 h-4" />
                                <span>Rank</span>
                            </Link>
                        </div>

                        {/* More Menu for Mobile (Hidden on Desktop) */}
                        <div className={`nav-unified__dropdown-container sm:hidden ${openDropdown === 'more' ? 'active-dropdown' : ''}`}>
                            <button
                                onClick={(e) => toggleDropdown(e, 'more')}
                                className={`nav-unified__link ${(isActive('/report') || isActive('/leaderboard')) ? 'active' : ''}`}
                            >
                                <MoreHorizontal className="w-4 h-4" />
                                <span>More</span>
                            </button>
                            <div className="nav-unified__dropdown-menu dropdown-right">
                                <Link to="/report" className={`nav-unified__dropdown-item ${isActive('/report') ? 'text-[var(--accent)] font-bold' : ''}`} onClick={() => setOpenDropdown(null)}>
                                    <Sparkles className="w-4 h-4" />
                                    AI Report
                                </Link>
                                <Link to="/leaderboard" className={`nav-unified__dropdown-item ${isActive('/leaderboard') ? 'text-[var(--accent)] font-bold' : ''}`} onClick={() => setOpenDropdown(null)}>
                                    <Trophy className="w-4 h-4" />
                                    Rank Leaderboard
                                </Link>
                            </div>
                        </div>

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

                {/* Mobile Status Overlay Removed upon request */}
            </nav>
        </div>
    )
}

