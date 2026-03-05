import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignedOut, SignInButton } from '@clerk/clerk-react'
import { MapPin, AlertTriangle, CheckCircle, ArrowRight, Shield, Eye, ThumbsUp, Clock, TrendingUp } from 'lucide-react'
import { useIssues, useStats } from '../hooks/useIssues'
import IssueMap from '../components/IssueMap'
import ReportsBoard from '../components/ReportsBoard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const features = [
    {
        icon: MapPin,
        title: 'Drop a Pin',
        description: 'Mark the exact spot so crews can find it fast.',
    },
    {
        icon: Eye,
        title: 'Follow Along',
        description: 'Track updates from report to resolution.',
    },
    {
        icon: ThumbsUp,
        title: 'Boost Priority',
        description: 'Upvote issues your neighborhood cares about.',
    },
    {
        icon: Shield,
        title: 'City Response',
        description: 'Officials triage, assign, and close issues visibly.',
    },
]

const STATUS_COLORS = ['#b45309', '#a16207', '#4d7c0f']
const CATEGORY_COLORS = ['#a16207', '#4d7c0f', '#8b5a2b', '#6b7280', '#b45309']
const statusNames = { REPORTED: 'Reported', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved' }
const categoryNames = { POTHOLE: 'Pothole', GARBAGE: 'Garbage', STREETLIGHT: 'Streetlight', WATER_LEAK: 'Water Leak', OTHER: 'Other' }

export default function Landing() {
    const location = useLocation()
    const { data } = useIssues({ limit: 50 })
    const { data: stats } = useStats()
    const issues = data?.issues || []

    useEffect(() => {
        if (!location.hash) return
        const id = location.hash.replace('#', '')
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [location.hash])

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
        <div className="min-h-screen bg-[color:var(--earth-50)] text-civic-900">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-civic-100/70 blur-3xl" />
                    <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-[color:var(--earth-accent)]/20 blur-3xl" />
                </div>

                <div className="page-container relative pt-16 pb-8">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-civic-200 text-xs text-civic-800 shadow-sm animate-float-slow">
                            <span className="w-2 h-2 rounded-full bg-[color:var(--earth-accent)]" />
                            Namma Bengaluru — Civic fixes made simple
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
                            Fixes, not fuss.
                            <span className="block text-civic-700">Report issues with a friendly nudge.</span>
                        </h1>

                        <p className="text-lg text-civic-700 leading-relaxed">
                            Spot a pothole, broken light, or garbage pile? Drop a quick report and watch the city respond.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Link to="/#reports" className="btn-primary flex items-center gap-2 hover:rotate-[-1deg]">
                                Report an Issue
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="btn-secondary hover:rotate-[1deg]">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 text-sm">
                            <span className="chip">Potholes</span>
                            <span className="chip">Streetlights</span>
                            <span className="chip">Garbage</span>
                            <span className="chip">Water leaks</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="page-container">
                <div className="flex flex-wrap gap-4">
                    <div className="card p-4 flex-1 min-w-[210px] group hover:-translate-y-1 hover:rotate-[0.4deg]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-civic-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-civic-700 group-hover:animate-wiggle" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold">{totalIssues}</p>
                                <p className="text-sm text-civic-700">Total issues</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-4 flex-1 min-w-[210px] group hover:-translate-y-1 hover:rotate-[-0.4deg]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-700 group-hover:animate-wiggle" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold">{unresolvedCount}</p>
                                <p className="text-sm text-civic-700">Unresolved</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-4 flex-1 min-w-[210px] group hover:-translate-y-1 hover:rotate-[0.3deg]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-lime-50 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-lime-700 group-hover:animate-wiggle" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold">{resolvedCount}</p>
                                <p className="text-sm text-civic-700">Resolved</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-4 flex-1 min-w-[210px] group hover:-translate-y-1 hover:rotate-[-0.3deg]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-civic-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-civic-700 group-hover:animate-wiggle" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold">{resolutionRate}%</p>
                                <p className="text-sm text-civic-700">Resolution rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reports */}
            <section id="reports" className="page-container scroll-mt-24 space-y-4">
                <div>
                    <h2 className="text-3xl font-semibold text-civic-900">Community Reports</h2>
                    <p className="text-civic-700">Browse recent issues, filter by category, or report a new one.</p>
                </div>
                <ReportsBoard scope="all" />
            </section>

            {/* Analytics Charts */}
            {totalIssues > 0 && (
                <section className="page-container space-y-6">
                    <div>
                        <h2 className="text-3xl font-semibold text-civic-900">Quick Insights</h2>
                        <p className="text-civic-700">A calm snapshot of what needs attention.</p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="card p-6 flex-1 min-w-[280px]">
                            <h3 className="font-semibold text-civic-900 mb-4">Resolved vs Unresolved</h3>
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
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-civic-700">
                                {statusData.map((s) => (
                                    <div key={s.name} className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
                                        {s.name} ({s.value})
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card p-6 flex-1 min-w-[280px]">
                            <h3 className="font-semibold text-civic-900 mb-4">Issues by Category</h3>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData} barSize={32}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e7ddc8" />
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
            <section className="page-container space-y-6">
                <div>
                    <h2 className="text-3xl font-semibold text-civic-900">How It Works</h2>
                    <p className="text-civic-700">A simple flow from report to resolution.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    {features.map((feature, i) => (
                        <div key={i} className="card p-5 flex-1 min-w-[220px] group hover:-translate-y-1 hover:rotate-[0.4deg]">
                            <div className="w-11 h-11 rounded-full bg-civic-100 flex items-center justify-center mb-3">
                                <feature.icon className="w-5 h-5 text-civic-700 group-hover:animate-wiggle" />
                            </div>
                            <h3 className="font-semibold text-civic-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-civic-700 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Map Preview */}
            <section className="page-container space-y-4">
                <div>
                    <h2 className="text-3xl font-semibold text-civic-900">Live Issue Map</h2>
                    <p className="text-civic-700">See reports across Bengaluru at a glance.</p>
                </div>
                <div className="card overflow-hidden">
                    <IssueMap issues={issues} height="480px" />
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 border-t border-civic-100 bg-white/60">
                <div className="page-container flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-civic-700 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-civic-900">PublicRes</span>
                    </div>
                    <p className="text-sm text-civic-700">
                        Built for Namma Bengaluru. Calm, clear, and community-first.
                    </p>
                </div>
            </footer>
        </div>
    )
}
