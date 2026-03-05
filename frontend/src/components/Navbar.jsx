import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Menu, X, Shield, MapPin } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-civic-500 to-civic-700 rounded-xl flex items-center justify-center shadow-lg shadow-civic-500/25 group-hover:shadow-civic-500/40 transition-shadow">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-civic-700 to-civic-500 bg-clip-text text-transparent">
                            PublicRes
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'bg-civic-50 text-civic-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Home
                        </Link>
                        <SignedIn>
                            <Link
                                to="/dashboard"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-civic-50 text-civic-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/admin"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${isActive('/admin') ? 'bg-civic-50 text-civic-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <Shield className="w-3.5 h-3.5" />
                                Admin
                            </Link>
                        </SignedIn>
                    </div>

                    {/* Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="btn-primary text-sm">Sign In</button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: 'w-9 h-9 ring-2 ring-civic-100',
                                    },
                                }}
                            />
                        </SignedIn>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 pt-2 space-y-1 animate-fade-in">
                        <Link
                            to="/"
                            className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            onClick={() => setMobileOpen(false)}
                        >
                            Home
                        </Link>
                        <SignedIn>
                            <Link
                                to="/dashboard"
                                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={() => setMobileOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/admin"
                                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={() => setMobileOpen(false)}
                            >
                                Admin Panel
                            </Link>
                            <div className="px-4 pt-2">
                                <UserButton />
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <div className="px-4 pt-2">
                                <SignInButton mode="modal">
                                    <button className="btn-primary text-sm w-full">Sign In</button>
                                </SignInButton>
                            </div>
                        </SignedOut>
                    </div>
                )}
            </div>
        </nav>
    )
}
