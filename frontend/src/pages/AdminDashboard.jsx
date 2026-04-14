import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { BarChart3, AlertTriangle, CheckCircle, Clock, Search, TrendingUp, Bell, ShieldCheck } from 'lucide-react'
import { useAdminIssues, useAnalytics, useAuthSync } from '../hooks/useIssues'
import AdminIssueTable from '../components/AdminIssueTable'
import AnalyticsCharts from '../components/AnalyticsCharts'
import NotificationsPanel from '../components/NotificationsPanel'

export default function AdminDashboard() {
    useAuthSync()

    const { data: me } = useQuery({ queryKey: ['me'], queryFn: api.getMe })

    const [filters, setFilters] = useState({ category: '', status: '', search: '' })
    const [activeTab, setActiveTab] = useState('issues') // 'issues' | 'analytics' | 'notifications'

    const { data, isLoading } = useAdminIssues({ ...filters, limit: 50 })
    const { data: analytics } = useAnalytics()

    if (me && me.user?.role === 'CITIZEN') {
        return <Navigate to="/dashboard" replace />
    }
    const issues = data?.issues || []

    const summaryCards = [
        {
            label: 'Total Issues',
            value: analytics?.totalIssues || 0,
            icon: AlertTriangle,
            color: 'text-[var(--glow)]',
            bg: 'bg-[var(--glow)]/10 border-[var(--glow)]/30',
        },
        {
            label: 'Reported',
            value: analytics?.byStatus?.find((s) => s.status === 'REPORTED')?.count || 0,
            icon: AlertTriangle,
            color: 'text-red-400',
            bg: 'bg-red-500/10 border-red-500/30',
        },
        {
            label: 'In Progress',
            value: analytics?.byStatus?.find((s) => s.status === 'IN_PROGRESS')?.count || 0,
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/30',
        },
        {
            label: 'Resolved',
            value: analytics?.byStatus?.find((s) => s.status === 'RESOLVED')?.count || 0,
            icon: CheckCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/30',
        },
    ]

    return (
        <div className="page-container py-12 md:py-24 mt-12 md:mt-16 w-full min-h-screen relative z-10">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[var(--glow)]/5 to-transparent -z-10 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl panel glass flex items-center justify-center border border-[var(--border-glow)] shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                        <ShieldCheck className="w-7 h-7 text-[var(--glow)]" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Command Center</h1>
                        <p className="text-[var(--text-dim)] font-medium mt-1">Namma Parihara Authority Protocol</p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {summaryCards.map((card, idx) => (
                    <div key={idx} className="panel glass p-6 rounded-2xl border border-[var(--border-clean)] relative overflow-hidden group hover:border-[var(--glow)]/40 transition-colors">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="text-[var(--text-dim)] font-bold text-sm uppercase tracking-wider">{card.label}</span>
                            <div className={`p-2.5 rounded-xl border ${card.bg}`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                        </div>
                        <h3 className="text-4xl font-black text-white relative z-10">{card.value}</h3>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-[var(--glow)]/10 transition-colors pointer-events-none"></div>
                    </div>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {['issues', 'analytics', 'notifications'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all whitespace-nowrap ${
                            activeTab === tab
                                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                : 'panel glass text-[var(--text-muted)] hover:text-white border-[var(--border-clean)] hover:border-white/20'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Active Tab Content */}
            <div className="relative z-10">
                {activeTab === 'issues' && (
                    <div className="panel glass border-[var(--border-clean)] rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                        <h2 className="text-2xl font-black text-white mb-8 border-b border-white/5 pb-4 flex items-center justify-between">
                            Ticket Registry
                            <span className="text-xs text-[var(--glow)] font-bold bg-[var(--glow)]/10 px-3 py-1 rounded-full border border-[var(--glow)]/20 uppercase tracking-widest">{issues.length} Active</span>
                        </h2>
                        <div className="overflow-hidden rounded-xl border border-white/5 bg-black/40">
                            <AdminIssueTable issues={issues} isLoading={isLoading} />
                        </div>
                    </div>
                )}
                {activeTab === 'analytics' && (
                    <div className="panel glass border-[var(--border-clean)] rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                         <h2 className="text-2xl font-black text-white mb-8 border-b border-white/5 pb-4">Data & Metrics</h2>
                        <AnalyticsCharts analytics={analytics} />
                    </div>
                )}
                {activeTab === 'notifications' && (
                    <div className="panel glass border-[var(--border-clean)] rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                         <h2 className="text-2xl font-black text-white mb-8 border-b border-white/5 pb-4">System Alerts</h2>
                        <NotificationsPanel />
                    </div>
                )}
            </div>
        </div>
    )
}
