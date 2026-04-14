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

    useEffect(() => {
        setOpenDropdown(null)
    }, [location.pathname])

    const isActive = (path) => location.pathname === path

    return (
        <div className={`nav-unified-container transition-all duration-500 z-[100] fixed top-0 w-full ${!isVisible ? '-translate-y-full opacity-0' : ''}`} ref={navRef}>
            <nav className="nav-unified relative bg-black/40 backdrop-blur-2xl border border-white/5 rounded-full mx-4 mt-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-500 overflow-visible before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-r before:from-[var(--glow)]/10 before:via-transparent before:to-[var(--glow)]/10">
                <div className="nav-unified__inner flex items-center justify-between w-full relative z-10">
                    <Link to="/" className="nav-unified__brand">
                        <img src="/logo.png" alt="Namma Parihara" className="nav-unified__logo hidden sm:block" />
                        <span className="nav-unified__title">Namma Parihara</span>
                    </Link>

                    <div className="nav-unified__links flex items-center gap-1 sm:gap-2">
                        <Link to="/" className={`nav-unified__link ${isActive('/') ? 'active' : ''}`}>
                            <Home className="w-4 h-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        <Link to="/map" className={`nav-unified__link ${isActive('/map') ? 'active' : ''}`}>
                            <Map className="w-4 h-4" />
                            <span className="hidden sm:inline">Map</span>
                        </Link>
                        
                        <Link to="/submit" className={`nav-unified__link ${isActive('/submit') ? 'active' : ''}`}>
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Report Issue</span>
                        </Link>

                        {/* Desktop Links (Hidden on Mobile) */}
                        <Link to="/community" className={`nav-unified__link hidden md:flex ${isActive('/community') ? 'active' : ''}`}>
                            <Users className="w-4 h-4" />
                            <span>Reports</span>
                        </Link>
                        <Link to="/report" className={`nav-unified__link hidden md:flex ${isActive('/report') ? 'active' : ''}`}>
                            <Sparkles className="w-4 h-4" />
                            <span>AI Report</span>
                        </Link>
                        <Link to="/leaderboard" className={`nav-unified__link hidden md:flex ${isActive('/leaderboard') ? 'active' : ''}`}>
                            <Trophy className="w-4 h-4" />
                            <span>Rank</span>
                        </Link>

                        {/* Mobile More Button (Hidden on Desktop) */}
                        <div className="relative md:hidden flex items-center">
                            <button onClick={(e) => toggleDropdown(e, 'more')} className={`nav-unified__link flex items-center justify-center p-2 rounded-full ${openDropdown === 'more' ? 'bg-white/10 text-white' : ''}`}>
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                            {openDropdown === 'more' && (
                                <div className="absolute top-full mt-4 right-0 w-48 panel glass rounded-2xl border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col p-2 gap-1 z-50 !bg-black/90 backdrop-blur-xl animate-scale-in origin-top-right">
                                    <Link to="/community" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg text-sm text-[var(--text-muted)] hover:text-white transition-colors">
                                        <Users className="w-4 h-4" /> Reports
                                    </Link>
                                    <Link to="/report" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg text-sm text-[var(--text-muted)] hover:text-white transition-colors">
                                        <Sparkles className="w-4 h-4" /> AI Report
                                    </Link>
                                    <Link to="/leaderboard" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg text-sm text-[var(--text-muted)] hover:text-white transition-colors">
                                        <Trophy className="w-4 h-4" /> Rank
                                    </Link>
                                </div>
                            )}
                        </div>

                        <SignedIn>
                            <Link to="/profile" className={`nav-unified__link ${isActive('/profile') ? 'active' : ''}`}>
                                <Shield className="w-4 h-4" />
                                <span className="hidden sm:inline">Profile</span>
                            </Link>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal" forceRedirectUrl="/profile">
                                <button className="nav-unified__link auth-btn">
                                    <User className="w-4 h-4" />
                                    <span className="hidden sm:inline">Login</span>
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>

                    <div className="nav-unified__actions hidden sm:flex">
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
            </nav>
        </div>
    )
}
