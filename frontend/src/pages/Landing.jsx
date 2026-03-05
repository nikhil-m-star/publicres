import { Link } from 'react-router-dom'
import { SignedOut, SignInButton } from '@clerk/clerk-react'
import { MapPin, AlertTriangle, CheckCircle, Users, ArrowRight, Shield, Eye, ThumbsUp } from 'lucide-react'
import { useIssues } from '../hooks/useIssues'
import IssueMap from '../components/IssueMap'

const stats = [
    { icon: AlertTriangle, label: 'Issues Reported', value: '1,247', color: 'text-red-500', bg: 'bg-red-50' },
    { icon: CheckCircle, label: 'Issues Resolved', value: '892', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Users, label: 'Active Citizens', value: '3,891', color: 'text-civic-500', bg: 'bg-civic-50' },
    { icon: MapPin, label: 'Areas Covered', value: '156', color: 'text-purple-500', bg: 'bg-purple-50' },
]

const features = [
    {
        icon: MapPin,
        title: 'Pin on Map',
        description: 'Drop a pin to precisely locate civic issues in your neighborhood.',
        gradient: 'from-red-500 to-orange-500',
    },
    {
        icon: Eye,
        title: 'Track Progress',
        description: 'Follow your reported issues from submission through resolution.',
        gradient: 'from-civic-500 to-blue-500',
    },
    {
        icon: ThumbsUp,
        title: 'Upvote & Comment',
        description: 'Support important issues and collaborate with your community.',
        gradient: 'from-emerald-500 to-teal-500',
    },
    {
        icon: Shield,
        title: 'Admin Dashboard',
        description: 'City authorities manage, prioritize, and resolve issues efficiently.',
        gradient: 'from-purple-500 to-pink-500',
    },
]

export default function Landing() {
    const { data } = useIssues({ limit: 50 })
    const issues = data?.issues || []

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-civic-950 via-civic-900 to-civic-800 text-white">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-civic-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-civic-400/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Open platform — Free for all citizens
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                            Your City.
                            <br />
                            <span className="bg-gradient-to-r from-civic-300 to-blue-300 bg-clip-text text-transparent">
                                Your Voice.
                            </span>
                        </h1>

                        <p className="text-lg lg:text-xl text-civic-200 mb-10 max-w-xl leading-relaxed">
                            Report potholes, broken streetlights, garbage overflow, and more. Track resolution progress and help authorities prioritize what matters most.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/dashboard" className="btn-primary text-base flex items-center gap-2">
                                Report an Issue
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="btn-secondary text-base !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 32L48 37.3C96 43 192 53 288 53.3C384 53 480 43 576 42.7C672 43 768 53 864 58.7C960 64 1056 64 1152 58.7C1248 53 1344 43 1392 37.3L1440 32V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V32Z"
                            fill="#f8fafc"
                        />
                    </svg>
                </div>
            </section>

            {/* Stats */}
            <section className="page-container -mt-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="card p-5 text-center group hover:scale-[1.02] transition-transform">
                            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="page-container py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        A simple, powerful platform connecting citizens with city authorities for faster issue resolution.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <div key={i} className="card p-6 group hover:scale-[1.02] transition-transform">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Map Preview */}
            <section className="page-container pb-20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Live Issue Map
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        See reported issues in your area. Red markers are new, yellow are in progress, green are resolved.
                    </p>
                </div>
                <IssueMap issues={issues} height="480px" />
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-civic-500 to-civic-700 rounded-lg flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-white">PublicRes</span>
                        </div>
                        <p className="text-sm">
                            Built for the public good. Empowering civic transparency.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
