const fs = require('fs');

const content = `import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Menu, X, Shield, Map, Trophy, Sparkles, Home, User, Plus, Users, MoreHorizontal } from 'lucide-react'
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
                // For bottom navbar, scroll down = hide by translating down
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
        <div className={\`nav-unified-container transition-all duration-500 z-[100] fixed bottom-4 md:bottom-auto md:top-0 w-full \${!isVisible ? 'translate-y-24 md:-translate-y-full opacity-0' : ''}\`} ref={navRef}>
            <nav className="nav-unified relative bg-black/60 backdrop-blur-2xl md:border border-white/10 rounded-full md:mx-4 md:mt-4 shadow-[0_-8px_32px_0_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)] md:shadow-[0_8px_32px_0_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-500 overflow-visible before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-r before:from-[var(--glow)]/10 before:via-transparent before:to-[var(--glow)]/10 mx-2 border-t">
                <div className="nav-unified__inner flex items-center justify-between w-full relative z-10 px-2 md:px-6 py-2 md:py-0">
                    
                    {/* Brand Profile - Desktop Only */}
                    <Link to="/" className="nav-unified__brand hidden md:flex min-w-[200px] items-center gap-3">
                        <img src="/logo.png" alt="Namma Parihara" className="w-8 h-8 opacity-90 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]" />
                        <span className="font-black text-xl text-white tracking-widest uppercase">Civic<span className="text-[var(--glow)]">Ledger</span></span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="nav-unified__links flex w-full justify-between md:justify-center items-center md:gap-4 lg:gap-6">
                        
                        <Link to="/" className={\`nav-unified__link flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-2xl md:rounded-full transition-all \${isActive('/') ? 'text-[var(--glow)] md:bg-white/5' : 'text-[var(--text-muted)] hover:text-white md:hover:bg-white/5'}\`}>
                            <Home className="w-6 h-6 md:w-4 md:h-4" />
                            <span className="text-[10px] md:text-[13px] font-bold uppercase tracking-wider">Home</span>
                        </Link>

                        <Link to="/map" className={\`nav-unified__link flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-2xl md:rounded-full transition-all \${isActive('/map') ? 'text-[var(--glow)] md:bg-white/5' : 'text-[var(--text-muted)] hover:text-white md:hover:bg-white/5'}\`}>
                            <Map className="w-6 h-6 md:w-4 md:h-4" />
                            <span className="text-[10px] md:text-[13px] font-bold uppercase tracking-wider">Map</span>
                        </Link>
                        
                        {/* Center Plus Button on Mobile for impact */}
                        <Link to="/submit" className={\`nav-unified__link flex flex-col md:flex-row items-center gap-1 md:gap-2 md:px-4 md:py-2 \${isActive('/submit') ? 'text-white' : 'text-[var(--text-muted)] hover:text-white'} transition-all\`}>
                            <div className="bg-[var(--glow)] rounded-full p-3 md:p-1.5 shadow-[0_0_20px_rgba(0,255,255,0.4)] text-black md:bg-transparent md:shadow-none md:text-inherit -mt-5 md:mt-0 md:border md:border-white/10 md:hover:bg-white/5">
                                <Plus className="w-7 h-7 md:w-4 md:h-4 md:text-white" />
                            </div>
                            <span className="hidden md:inline text-[13px] font-bold uppercase tracking-wider text-white">Report</span>
                        </Link>

                        {/* Desktop Links (Hidden on Mobile) */}
                        <Link to="/community" className={\`nav-unified__link hidden md:flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-2xl md:rounded-full transition-all \${isActive('/community') ? 'text-[var(--glow)] md:bg-white/5' : 'text-[var(--text-muted)] hover:text-white md:hover:bg-white/5'}\`}>
                            <Users className="w-5 h-5 md:w-4 md:h-4" />
                            <span className="text-[10px] md:text-[13px] font-bold uppercase tracking-wider">Reports</span>
                        </Link>

                        <Link to="/leaderboard" className={\`nav-unified__link hidden md:flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-2xl md:rounded-full transition-all \${isActive('/leaderboard') ? 'text-[var(--glow)] md:bg-white/5' : 'text-[var(--text-muted)] hover:text-white md:hover:bg-white/5'}\`}>
                            <Trophy className="w-5 h-5 md:w-4 md:h-4" />
                            <span className="text-[10px] md:text-[13px] font-bold uppercase tracking-wider">Rank</span>
                        </Link>

                        {/* Mobile More Dropdown */}
                        <div className="relative md:hidden flex items-center">
                            <button onClick={(e) => toggleDropdown(e, 'more')} className={\`nav-unified__link flex flex-col items-center gap-1 px-3 py-2 transition-colors \${openDropdown === 'more' ? 'text-[var(--glow)]' : 'text-[var(--text-muted)] hover:text-white'}\`}>
                                <MoreHorizontal className="w-6 h-6 " />
                                <span className="text-[10px] font-bold uppercase tracking-wider">More</span>
                            </button>
                            {openDropdown === 'more' && (
                                <div className="absolute bottom-full right-0 mb-4 w-48 panel glass rounded-[1.5rem] border border-[var(--glow)]/30 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.8)] flex flex-col p-3 gap-2 z-50 !bg-black/95 backdrop-blur-3xl animate-scale-in origin-bottom-right">
                                    <Link to="/community" className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-white transition-all">
                                        <Users className="w-5 h-5 text-[var(--glow)]" /> All Reports
                                    </Link>
                                    <Link to="/report" className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-white transition-all">
                                        <Sparkles className="w-5 h-5 text-[var(--glow)]" /> AI Report
                                    </Link>
                                    <Link to="/leaderboard" className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-white transition-all">
                                        <Trophy className="w-5 h-5 text-[var(--glow)]" /> Ranking
                                    </Link>
                                    <SignedIn>
                                        <Link to="/profile" className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-white transition-all border-t border-white/10 mt-2 pt-4">
                                            <Shield className="w-5 h-5" /> Account Map
                                        </Link>
                                    </SignedIn>
                                    <SignedOut>
                                        <SignInButton mode="modal" forceRedirectUrl="/profile">
                                            <button className="flex w-full items-center gap-4 p-3 hover:bg-white/10 rounded-xl text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--glow)] transition-all border-t border-white/10 mt-2 pt-4">
                                                <User className="w-5 h-5" /> Connect ID
                                            </button>
                                        </SignInButton>
                                    </SignedOut>
                                </div>
                            )}
                        </div>

                        {/* Desktop Profile Node */}
                        <div className="hidden md:flex ml-4 items-center">
                            <SignedIn>
                                <NotificationsDropdown />
                                <div className="ml-4 pl-4 border-l border-white/10 flex items-center gap-3">
                                    <Link to="/profile" className={\`text-[13px] font-bold uppercase tracking-wider transition-colors \${isActive('/profile') ? 'text-[var(--glow)]' : 'text-[var(--text-muted)] hover:text-white'}\`}>
                                        <Shield className="w-5 h-5" />
                                    </Link>
                                    <div className="ring-2 ring-white/10 rounded-full overflow-hidden w-8 h-8 flex">
                                        <UserButton appearance={{ elements: { avatarBox: "w-full h-full" } }} />
                                    </div>
                                </div>
                            </SignedIn>
                            <SignedOut>
                                <div className="ml-4 pl-4 border-l border-white/10">
                                    <SignInButton mode="modal" forceRedirectUrl="/profile">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-[12px] font-black uppercase tracking-widest text-white transition-all">
                                            Connect <Shield className="w-3.5 h-3.5" />
                                        </button>
                                    </SignInButton>
                                </div>
                            </SignedOut>
                        </div>
                    </div>

                </div>
            </nav>
        </div>
    )
}
`
fs.writeFileSync('src/components/Navbar.jsx', content);
