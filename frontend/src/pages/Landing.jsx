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
        <div className="landing">
            <section className="hero">
                <div className="hero__glow hero__glow--ember" />
                <div className="hero__glow hero__glow--moss" />
                <div className="page-container hero__grid">
                    <div className="hero__copy">
                        <div className="hero__badge">
                            <Sparkles className="w-4 h-4" />
                            Civic signal, tuned for Bengaluru
                        </div>
                        <h1 className="hero__title">
                            Fixes, not fuss.
                            <span>Report fast. Track brighter.</span>
                        </h1>
                        <p className="hero__subtitle">
                            Drop a quick report, share the signal, and let the city move with clarity. A bold, friendly way to keep Bengaluru in flow.
                        </p>
                        <div className="hero__actions">
                            <Link to="/#reports" className="btn-primary">
                                Report an Issue
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="btn-secondary">Sign In</button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                        <div className="hero__tags">
                            <span className="chip">Potholes</span>
                            <span className="chip">Streetlights</span>
                            <span className="chip">Garbage</span>
                            <span className="chip">Water leaks</span>
                        </div>
                    </div>

                    <div className="hero__visual">
                        <div className="radar-card">
                            <div className="radar">
                                <div className="radar__ring" />
                                <div className="radar__ring" />
                                <div className="radar__ring" />
                                <span className="radar__sweep" />
                                <span className="radar__blip radar__blip--one" />
                                <span className="radar__blip radar__blip--two" />
                                <span className="radar__blip radar__blip--three" />
                            </div>
                            <div className="radar__meta">
                                <div>
                                    <p>Live issues</p>
                                    <strong>{totalIssues}</strong>
                                </div>
                                <div>
                                    <p>Resolved</p>
                                    <strong>{resolutionRate}%</strong>
                                </div>
                                <div>
                                    <p>Active</p>
                                    <strong>{unresolvedCount}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="hero__note">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Signal spikes get routed to the nearest ward team within minutes.</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-container stat-strip">
                <div className="stat-card">
                    <AlertTriangle className="w-5 h-5" />
                    <div>
                        <p>Total issues</p>
                        <strong>{totalIssues}</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <Clock className="w-5 h-5" />
                    <div>
                        <p>Unresolved</p>
                        <strong>{unresolvedCount}</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                        <p>Resolved</p>
                        <strong>{resolvedCount}</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <TrendingUp className="w-5 h-5" />
                    <div>
                        <p>Resolution rate</p>
                        <strong>{resolutionRate}%</strong>
                    </div>
                </div>
            </section>

            <section id="reports" className="page-container section">
                <div className="section__head">
                    <h2>Community Reports</h2>
                    <p>Browse recent issues, filter by category, or report a new one.</p>
                </div>
                <div className="panel">
                    <ReportsBoard scope="all" />
                </div>
            </section>

            {totalIssues > 0 && (
                <section className="page-container section">
                    <div className="section__head">
                        <h2>Quick Insights</h2>
                        <p>A calm snapshot of what needs attention.</p>
                    </div>
                    <div className="insight-grid">
                        <div className="panel">
                            <h3>Resolved vs Unresolved</h3>
                            <div className="chart-box">
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
                            <div className="legend">
                                {statusData.map((s) => (
                                    <div key={s.name} className="legend__item">
                                        <span className="legend__dot" style={{ background: s.fill }} />
                                        {s.name} ({s.value})
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="panel">
                            <h3>Issues by Category</h3>
                            <div className="chart-box">
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

            <section className="page-container section">
                <div className="section__head">
                    <h2>How It Works</h2>
                    <p>A simple flow from report to resolution.</p>
                </div>
                <div className="feature-grid">
                    {features.map((feature, i) => (
                        <div key={i} className="feature-card">
                            <div className="feature-card__icon">
                                <feature.icon className="w-5 h-5" />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="page-container section">
                <div className="section__head">
                    <h2>Live Issue Map</h2>
                    <p>See reports across Bengaluru at a glance.</p>
                </div>
                <div className="map-panel">
                    <IssueMap issues={issues} height="480px" />
                </div>
            </section>

            <footer className="footer">
                <div className="page-container footer__inner">
                    <div className="footer__brand">
                        <span className="nav-logo">
                            <MapPin className="w-4 h-4" />
                        </span>
                        <span>Namma Parihara</span>
                    </div>
                    <p>Built for Namma Bengaluru. Bold, clear, and community-first.</p>
                </div>
            </footer>
        </div>
    )
}
