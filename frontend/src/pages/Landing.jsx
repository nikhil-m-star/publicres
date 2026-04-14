import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignedOut, SignInButton } from '@clerk/clerk-react'
import { MapPin, AlertTriangle, CheckCircle, ArrowRight, Shield, Eye, ThumbsUp, Clock, TrendingUp, Sparkles, Activity } from 'lucide-react'
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

const STATUS_COLORS = ['#00ffff', '#009999', '#003333']
const CATEGORY_COLORS = ['#00ffff', '#00cccc', '#009999', '#006666', '#003333']
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
        <div className="landing relative overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--glow)]/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>

            <section className="hero relative z-10 pt-24 pb-16">
                <div className="page-container hero__grid">
                    <div className="hero__copy">
                        <div className="hero__badge backdrop-blur-md border border-[var(--border-glow)] mb-4">
                            <Activity className="w-4 h-4 text-[var(--glow)]" />
                            <span className="text-[var(--text-main)] font-semibold tracking-wider">Live Citizen Platform</span>
                        </div>
                        <h1 className="hero__title text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                            Namma Parihara.
                            <span className="block text-2xl md:text-4xl font-light mt-4 text-[var(--text-muted)]">
                                Fixes, not fuss. Report fast.
                            </span>
                        </h1>
                        <p className="hero__subtitle mt-6 text-lg text-[var(--text-dim)] border-l-2 border-[var(--glow)] pl-4">
                            Empowering Bengaluru citizens to report civic issues seamlessly. Track real-time progress, upvote local priorities, and hold authorities accountable.
                        </p>
                        <div className="hero__actions mt-8 flex gap-4">
                            <Link to="/submit" className="btn-primary glow-btn px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
                                Report Issue
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <SignedOut>
                                <SignInButton mode="modal" forceRedirectUrl="/profile">
                                    <button className="btn-secondary px-8 py-4 text-lg font-bold rounded-xl border border-[var(--border-clean)] hover:border-[var(--glow)] transition-all duration-300 backdrop-blur-sm bg-black/30">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                        <div className="hero__note mt-8 w-fit bg-black/40 backdrop-blur-md">
                            <Sparkles className="w-4 h-4 text-[var(--glow)]" />
                            <span>Join thousands of citizens improving the city everyday.</span>
                        </div>
                    </div>

                    <div className="hero__visual perspective-1000">
                        <div className="radar-card glass hero-3d-card border-[var(--border-glow)] shadow-[0_0_40px_rgba(0,255,255,0.1)]">
                            <div className="radar">
                                <div className="radar__ring" />
                                <div className="radar__ring" />
                                <div className="radar__ring" />
                                <span className="radar__sweep bg-gradient-to-r from-transparent via-[var(--glow)] to-transparent" />
                                <span className="radar__blip radar__blip--one" />
                                <span className="radar__blip radar__blip--two" />
                                <span className="radar__blip radar__blip--three" />
                            </div>
                            <div className="radar__meta mt-6 grid grid-cols-3 gap-4 text-center border-t border-[var(--border-clean)] pt-6">
                                <div>
                                    <p className="text-[var(--text-muted)] text-sm mb-1 uppercase tracking-wider">Live</p>
                                    <strong className="text-2xl text-white font-black">{totalIssues}</strong>
                                </div>
                                <div>
                                    <p className="text-[var(--text-muted)] text-sm mb-1 uppercase tracking-wider">Resolved</p>
                                    <strong className="text-2xl text-[var(--glow)] font-black">{resolutionRate}%</strong>
                                </div>
                                <div>
                                    <p className="text-[var(--text-muted)] text-sm mb-1 uppercase tracking-wider">Active</p>
                                    <strong className="text-2xl text-white font-black">{unresolvedCount}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-container relative z-10 -mt-8 mb-16 px-4 md:px-0">
                <div className="stat-strip grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="stat-card glass border border-[var(--border-clean)] hover:border-[var(--border-glow)] transition-colors p-6 rounded-2xl flex items-center gap-4 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl">
                        <div className="p-3 bg-[var(--glow)]/10 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-[var(--glow)]" />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-sm uppercase tracking-wider font-medium">Total issues</p>
                            <strong className="text-2xl font-bold text-white">{totalIssues}</strong>
                        </div>
                    </div>
                    <div className="stat-card glass border border-[var(--border-clean)] hover:border-[var(--border-glow)] transition-colors p-6 rounded-2xl flex items-center gap-4 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl">
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <Clock className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-sm uppercase tracking-wider font-medium">Unresolved</p>
                            <strong className="text-2xl font-bold text-white">{unresolvedCount}</strong>
                        </div>
                    </div>
                    <div className="stat-card glass border border-[var(--border-clean)] hover:border-[var(--border-glow)] transition-colors p-6 rounded-2xl flex items-center gap-4 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-sm uppercase tracking-wider font-medium">Resolved</p>
                            <strong className="text-2xl font-bold text-white">{resolvedCount}</strong>
                        </div>
                    </div>
                    <div className="stat-card glass border border-[var(--border-clean)] hover:border-[var(--border-glow)] transition-colors p-6 rounded-2xl flex items-center gap-4 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-sm uppercase tracking-wider font-medium">Clear Rate</p>
                            <strong className="text-2xl font-bold text-white">{resolutionRate}%</strong>
                        </div>
                    </div>
                </div>
            </section>

            {totalIssues > 0 && (
                <section className="page-container section py-24 relative z-10 border-t border-[var(--border-glass)]">
                    <div className="section__head mb-16 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">City Insights</h2>
                        <p className="text-[var(--text-muted)] text-xl max-w-2xl mx-auto">A transparent view of what needs attention across our neighborhoods.</p>
                    </div>
                    <div className="insight-grid grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="panel glass p-8 rounded-3xl border border-[var(--border-clean)] bg-black/40 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(0,255,255,0.05)] transition-all">
                            <h3 className="text-2xl font-semibold mb-8 text-white flex items-center gap-3">
                                <Activity className="w-5 h-5 text-[var(--glow)]" />
                                Status Distribution
                            </h3>
                            <div className="chart-box h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={95}
                                            paddingAngle={6}
                                            dataKey="value"
                                            stroke="none"
                                            cornerRadius={8}
                                        >
                                            {statusData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} style={{ filter: `drop-shadow(0 0 8px ${entry.fill}88)` }} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '16px', border: '1px solid var(--border-clean)', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', background: 'rgba(5,5,5,0.9)', color: '#fff', backdropFilter: 'blur(10px)' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="legend flex flex-wrap justify-center gap-4 mt-4">
                                {statusData.map((s) => (
                                    <div key={s.name} className="legend__item flex items-center gap-2 text-sm text-[var(--text-main)] font-medium bg-white/5 py-1.5 px-3 rounded-full border border-white/5">
                                        <span className="legend__dot w-3 h-3 rounded-full" style={{ background: s.fill, boxShadow: `0 0 10px ${s.fill}` }} />
                                        {s.name} <span className="text-[var(--text-muted)] opacity-80 ml-1">({s.value})</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="panel glass p-8 rounded-3xl border border-[var(--border-clean)] bg-black/40 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(0,255,255,0.05)] transition-all">
                            <h3 className="text-2xl font-semibold mb-8 text-white flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-[var(--glow)]" />
                                Issues by Category
                            </h3>
                            <div className="chart-box h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData} barSize={36} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                            contentStyle={{ borderRadius: '16px', border: '1px solid var(--border-clean)', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', background: 'rgba(5,5,5,0.9)', color: '#fff', backdropFilter: 'blur(10px)' }}
                                        />
                                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
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

            <section className="page-container section py-24 relative z-10">
                <div className="section__head mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
                    <p className="text-[var(--text-muted)] text-xl max-w-2xl mx-auto">A seamless flow engineered for maximum civic impact.</p>
                </div>
                <div className="feature-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <div key={i} className="feature-card group p-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.05] hover:border-[var(--glow)]/50 transition-all duration-300 hover:-translate-y-2">
                            <div className="feature-card__icon w-14 h-14 rounded-2xl bg-[var(--glow)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-[var(--glow)]/20 shadow-[inset_0_0_12px_rgba(0,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                                <feature.icon className="w-7 h-7 text-[var(--glow)]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                            <p className="text-[var(--text-dim)] leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="page-container section py-24 relative z-10 border-t border-[var(--border-glass)]">
                <div className="section__head mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Live Map</h2>
                        <p className="text-[var(--text-muted)] text-xl">See reports surfacing across Bengaluru at a glance.</p>
                    </div>
                    <Link to="/map" className="px-6 py-3 rounded-xl border border-[var(--border-clean)] bg-white/5 hover:bg-[var(--glow)]/10 hover:border-[var(--glow)]/50 transition-all text-white font-medium flex items-center gap-2">
                        Explore Full Map <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="map-panel rounded-[2rem] overflow-hidden border border-[var(--border-glass)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
                    <IssueMap issues={issues} height={window.innerWidth < 768 ? '400px' : '600px'} />
                </div>
            </section>

            <footer className="footer relative z-10 border-t border-[var(--border-clean)] mt-12 bg-black/60 backdrop-blur-md pb-8">
                <div className="page-container footer__inner flex flex-col md:flex-row items-center justify-between gap-6 pt-12">
                    <div className="footer__brand flex items-center gap-3">
                        <span className="nav-logo p-2 bg-[var(--glow)]/10 rounded-xl border border-[var(--glow)]/20">
                            <img src="/logo.png" alt="Namma Parihara" className="w-6 h-6" />
                        </span>
                        <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">Namma Parihara</span>
                    </div>
                    <p className="text-[var(--text-dim)] text-center md:text-right max-w-sm">Built for Namma Bengaluru. Bold, clear, and community-first.</p>
                </div>
            </footer>
        </div>
    )
}
