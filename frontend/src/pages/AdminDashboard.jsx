import { useState } from 'react'
import { BarChart3, AlertTriangle, CheckCircle, Clock, Search, TrendingUp, Bell } from 'lucide-react'
import { useAdminIssues, useAnalytics, useAuthSync } from '../hooks/useIssues'
import AdminIssueTable from '../components/AdminIssueTable'
import AnalyticsCharts from '../components/AnalyticsCharts'
import NotificationsPanel from '../components/NotificationsPanel'

export default function AdminDashboard() {
    useAuthSync()

    const [filters, setFilters] = useState({ category: '', status: '', search: '' })
    const [activeTab, setActiveTab] = useState('issues') // 'issues' | 'analytics' | 'notifications'

    const { data, isLoading } = useAdminIssues({ ...filters, limit: 50 })
    const { data: analytics } = useAnalytics()
    const issues = data?.issues || []

    const summaryCards = [
        {
            label: 'Total Issues',
            value: analytics?.totalIssues || 0,
            icon: AlertTriangle,
            color: 'text-civic-600',
            bg: 'bg-civic-50',
        },
        {
            label: 'Reported',
            value: analytics?.byStatus?.find((s) => s.status === 'REPORTED')?.count || 0,
            icon: AlertTriangle,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            label: 'In Progress',
            value: analytics?.byStatus?.find((s) => s.status === 'IN_PROGRESS')?.count || 0,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
        {
            label: 'Resolved',
            value: analytics?.byStatus?.find((s) => s.status === 'RESOLVED')?.count || 0,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            label: 'Resolution Rate',
            value: `${analytics?.resolutionRate || 0}%`,
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
    ]

    return (
        <div className="page-container">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage and resolve civic issues</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {summaryCards.map((card) => (
                    <div key={card.label} className="card p-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                                <card.icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{card.value}</p>
                                <p className="text-xs text-gray-500">{card.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('issues')}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'issues'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Issues
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === 'analytics'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Analytics
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === 'notifications'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Bell className="w-3.5 h-3.5" />
                    Notifications
                </button>
            </div>

            {activeTab === 'analytics' ? (
                <AnalyticsCharts data={analytics} />
            ) : activeTab === 'notifications' ? (
                <NotificationsPanel />
            ) : (
                <>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                value={filters.search}
                                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                                className="input-field pl-10"
                            />
                        </div>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                            className="input-field w-auto min-w-[140px]"
                        >
                            <option value="">All Categories</option>
                            <option value="POTHOLE">Pothole</option>
                            <option value="GARBAGE">Garbage</option>
                            <option value="STREETLIGHT">Streetlight</option>
                            <option value="WATER_LEAK">Water Leak</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                            className="input-field w-auto min-w-[130px]"
                        >
                            <option value="">All Status</option>
                            <option value="REPORTED">Reported</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="card overflow-hidden">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-3 border-civic-200 border-t-civic-600 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <AdminIssueTable issues={issues} />
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
