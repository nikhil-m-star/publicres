import { Link } from 'react-router-dom'
import { SignedOut, SignInButton } from '@clerk/clerk-react'
import { MapPin, AlertTriangle, CheckCircle, Users, ArrowRight, Shield, Eye, ThumbsUp, Clock, TrendingUp } from 'lucide-react'
import { useIssues, useStats } from '../hooks/useIssues'
import IssueMap from '../components/IssueMap'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const features = [
    {
        icon: MapPin,
        title: 'Pin on Map',
        description: 'Auto-detect your location in Bengaluru and report issues right where you are.',
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

const STATUS_COLORS = ['#ef4444', '#f59e0b', '#22c55e']
const CATEGORY_COLORS = ['#f97316', '#22c55e', '#eab308', '#3b82f6', '#6b7280']
const statusNames = { REPORTED: 'Reported', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved' }
const categoryNames = { POTHOLE: 'Pothole', GARBAGE: 'Garbage', STREETLIGHT: 'Streetlight', WATER_LEAK: 'Water Leak', OTHER: 'Other' }

export default function Landing() {
    const { data } = useIssues({ limit: 50 })
    const { data: stats } = useStats()
    const issues = data?.issues || []

    const totalIssues = stats?.totalIssues || 0
    const resolvedCount = stats?.byStatus?.find((s) => s.status === 'RESOLVED')?.count || 0
    const unresolvedCount = totalIssues - resolvedCount
    const resolutionRate = stats?.resolutionRate || 0

    const statusData = (stats?.byStatus || []).map((s, i) => ({
        name: statusNames[s.status] || s.status,
        value: s.count,
        fill: STATUS_COLORS[i % STATUS_COLORS.length],
    }))

    const categoryData = (stats?.byCategory || []).map((c, i) => ({
        name: categoryNames[c.category] || c.category,
        count: c.count,
        fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }))

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
                            Namma Bengaluru — Open civic platform
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                            Your City.
                            <br />
                            <span className="bg-gradient-to-r from-civic-300 to-blue-300 bg-clip-text text-transparent">
                                Your Voice.
                            </span>
                        </h1>

                        <p className="text-lg lg:text-xl text-civic-200 mb-10 max-w-xl leading-relaxed">
                            Report potholes, broken streetlights, garbage overflow, and more across Bengaluru. Track resolution progress and help BBMP prioritize what matters most to Namma Bengaluru.
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

            {/* Live Stats */}
            <section className="page-container -mt-4">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="card p-5 text-center group hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 bg-civic-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <AlertTriangle className="w-6 h-6 text-civic-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{totalIssues}</p>
                        <p className="text-sm text-gray-500">Total Issues</p>
                    </div>
                    <div className="card p-5 text-center group hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 text-red-500" />
                        </div>
                        <p className="text-2xl font-bold text-red-600 mb-1">{unresolvedCount}</p>
                        <p className="text-sm text-gray-500">Unresolved</p>
                    </div>
                    <div className="card p-5 text-center group hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-2xl font-bold text-emerald-600 mb-1">{resolvedCount}</p>
                        <p className="text-sm text-gray-500">Resolved</p>
                    </div>
                    <div className="card p-5 text-center group hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="w-6 h-6 text-purple-500" />
                        </div>
                        <p className="text-2xl font-bold text-purple-600 mb-1">{resolutionRate}%</p>
                        <p className="text-sm text-gray-500">Resolution Rate</p>
                    </div>
                    <div className="card p-5 text-center group hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <MapPin className="w-6 h-6 text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold text-amber-600 mb-1">Bengaluru</p>
                        <p className="text-sm text-gray-500">Coverage Area</p>
                    </div>
                </div>
            </section>

            {/* Analytics Charts */}
            {totalIssues > 0 && (
                <section className="page-container py-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Live Analytics</h2>
                        <p className="text-gray-500">Real-time civic issue data for Bengaluru</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Status pie */}
                        <div className="card p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Resolved vs Unresolved</h3>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={85}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-4 mt-2">
                                {statusData.map((s) => (
                                    <div key={s.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
                                        {s.name} ({s.value})
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Category bar */}
                        <div className="card p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Issues by Category</h3>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData} barSize={36}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                            {categoryData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Features */}
            <section className="page-container py-20">
                <div className="text-center mb-14">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        A simple, powerful platform connecting Bengaluru citizens with BBMP for faster issue resolution.
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
                        Live Issue Map — Bengaluru
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        See reported issues across Bengaluru. Red markers are new, yellow are in progress, green are resolved.
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
                            Built for Namma Bengaluru. Empowering civic transparency.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
