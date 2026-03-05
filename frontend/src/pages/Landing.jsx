import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignedOut, SignInButton } from '@clerk/clerk-react'
import { MapPin, AlertTriangle, CheckCircle, ArrowRight, Shield, Eye, ThumbsUp, Clock, TrendingUp, Sparkles } from 'lucide-react'
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

const STATUS_COLORS = ['#ff8f3d', '#f0c47b', '#8fa14b']
const CATEGORY_COLORS = ['#ff8f3d', '#8fa14b', '#d79a4e', '#6b7f35', '#f0c47b']
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
        <div className="min-h-screen bg-[color:var(--earth-950)] text-[color:var(--earth-ink)]">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-[color:var(--earth-ember)]/10 blur-3xl glow-orb animate-glow-pulse" />
                    <div className="absolute top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[color:var(--earth-moss)]/20 blur-3xl glow-moss animate-glow-pulse" />
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,143,61,0.2),_transparent_55%)]" />
                </div>

                <div className="page-container relative pt-20 pb-12">
                    <div className="max-w-3xl space-y-7">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--earth-900)] border border-civic-800 text-xs text-[color:var(--earth-muted)] shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-ember-300" />
                            Namma Bengaluru — civic fixes made simple
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-semibold leading-tight">
                            Fixes, not fuss.
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-ember-300 via-civic-200 to-moss-300">
                                Report fast. Track brighter.
                            </span>
                        </h1>

                        <p className="text-lg text-[color:var(--earth-muted)] leading-relaxed max-w-2xl">
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
                    <div className="card p-5 flex-1 min-w-[220px] group hover:-translate-y-1 hover:rotate-[0.4deg]">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[color:var(--earth-900)] border border-civic-800 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-ember-300 group-hover:animate-wiggle" />
                            </div>
                            <div>
                                <p className="text-3xl font-semibold">{totalIssues}</p>
                                <p className="text-sm text-[color:var(--earth-muted)]">Total issues</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-5 flex-1 min-w-[220px] group hover:-translate-y-1 hover:rotate-[-0.4deg]">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[color:var(--earth-900)] border border-civic-800 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-amber-200 group-hover:animate-wiggle" />
                            </div>
                            <div>
                                <p className="text-3xl font-semibold">{unresolvedCount}</p>
                                <p className="text-sm text-[color:var(--earth-muted)]">Unresolved</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-5 flex-1 min-w-[220px] group hover:-translate-y-1 hover:rotate-[0.3deg]">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[color:var(--earth-900)] border border-civic-800 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-moss-300 group-hover:animate-wiggle" />
                            </div>
                            <div>
                                <p className="text-3xl font-semibold">{resolvedCount}</p>
                                <p className="text-sm text-[color:var(--earth-muted)]">Resolved</p>
                            </div>
                        </div>
                    </div>
                    <div className="card p-5 flex-1 min-w-[220px] group hover:-translate-y-1 hover:rotate-[-0.3deg]">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[color:var(--earth-900)] border border-civic-800 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-ember-300 group-hover:animate-wiggle" />
                            </div>
                            <div>
                                <p className="text-3xl font-semibold">{resolutionRate}%</p>
                                <p className="text-sm text-[color:var(--earth-muted)]">Resolution rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reports */}
            <section id="reports" className="page-container scroll-mt-24 space-y-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-semibold">Community Reports</h2>
                    <p className="text-[color:var(--earth-muted)]">Browse recent issues, filter by category, or report a new one.</p>
                </div>
                <div className="card-glass p-2">
                    <ReportsBoard scope="all" />
                </div>
            </section>

            {/* Analytics Charts */}
            {totalIssues > 0 && (
                <section className="page-container space-y-6">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-semibold">Quick Insights</h2>
                        <p className="text-[color:var(--earth-muted)]">A calm snapshot of what needs attention.</p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="card p-6 flex-1 min-w-[280px]">
                            <h3 className="font-semibold mb-4">Resolved vs Unresolved</h3>
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
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', background: '#1f140e', color: '#f6efe4' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-[color:var(--earth-muted)]">
                                {statusData.map((s) => (
                                    <div key={s.name} className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
                                        {s.name} ({s.value})
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card p-6 flex-1 min-w-[280px]">
                            <h3 className="font-semibold mb-4">Issues by Category</h3>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData} barSize={32}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#3d2a1c" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#f0e0c7' }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#f0e0c7' }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', background: '#1f140e', color: '#f6efe4' }} />
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
                    <h2 className="text-3xl sm:text-4xl font-semibold">How It Works</h2>
                    <p className="text-[color:var(--earth-muted)]">A simple flow from report to resolution.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    {features.map((feature, i) => (
                        <div key={i} className="card p-5 flex-1 min-w-[220px] group hover:-translate-y-1 hover:rotate-[0.4deg]">
                            <div className="w-12 h-12 rounded-2xl bg-[color:var(--earth-900)] border border-civic-800 flex items-center justify-center mb-3">
                                <feature.icon className="w-5 h-5 text-ember-300 group-hover:animate-wiggle" />
                            </div>
                            <h3 className="font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-[color:var(--earth-muted)] leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Map Preview */}
            <section className="page-container space-y-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-semibold">Live Issue Map</h2>
                    <p className="text-[color:var(--earth-muted)]">See reports across Bengaluru at a glance.</p>
                </div>
                <div className="card overflow-hidden border border-civic-700/70">
                    <IssueMap issues={issues} height="480px" />
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 border-t border-civic-800 bg-[color:var(--earth-900)]">
                <div className="page-container flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-ember-500 flex items-center justify-center shadow-[0_8px_20px_rgba(255,143,61,0.35)]">
                            <MapPin className="w-4 h-4 text-black" />
                        </div>
                        <span className="font-semibold">PublicRes</span>
                    </div>
                    <p className="text-sm text-[color:var(--earth-muted)]">
                        Built for Namma Bengaluru. Bold, clear, and community-first.
                    </p>
                </div>
            </footer>
        </div>
    )
}
