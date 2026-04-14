import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Plus, List, Map as MapIcon, X, Search } from 'lucide-react'
import { useIssuesScope, useAuthSync } from '../hooks/useIssues'
import IssueCard from './IssueCard'
import IssueForm from './IssueForm'
import IssueMap from './IssueMap'

import { PlayfulLoader } from './ui/Loading'

export default function ReportsBoard({
    scope = 'all',
    title = 'Community Reports',
    subtitle = 'Report and track civic issues in your area',
    showFormToggle = true,
    emptyTitle,
    emptySubtitle,
}) {
    useAuthSync()

    const [showForm, setShowForm] = useState(false)
    const [view, setView] = useState('list')
    const [filters, setFilters] = useState({ category: '', status: '', search: '' })
    const [page, setPage] = useState(1)

    useEffect(() => { setPage(1) }, [filters])

    const { data, isLoading } = useIssuesScope(scope, { ...filters, page, limit: 12 })
    const issues = data?.issues || []
    const pagination = data?.pagination || {}

    const resolvedEmptyTitle = emptyTitle || (scope === 'mine' ? 'No reports yet' : 'No issues found')
    const resolvedEmptySubtitle =
        emptySubtitle ||
        (scope === 'mine'
            ? 'Your submitted reports will appear here.'
            : 'Be the first to report a civic issue!')

    return (
        <div className="relative z-10 w-full mb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--border-clean)]">
                <div>
                    <h2 className="text-3xl font-black text-white">{title}</h2>
                    <p className="text-[var(--text-dim)] font-medium text-lg mt-1">{subtitle}</p>
                </div>
                {showFormToggle && (
                    <>
                        <SignedIn>
                            <Link
                                to="/submit"
                                className="flex items-center gap-2 text-sm font-black px-6 py-3 rounded-xl transition-all panel glass border-[var(--border-clean)] hover:border-[var(--glow)]/50 hover:bg-[var(--glow)]/10 text-white shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] uppercase tracking-wider"
                            >
                                <Plus className="w-5 h-5 text-[var(--glow)]" /> Report Issue
                            </Link>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal" forceRedirectUrl="/profile">
                                <button className="flex items-center gap-2 text-sm font-black px-6 py-3 rounded-xl transition-all panel glass border-[var(--border-clean)] hover:border-[var(--glow)]/50 hover:bg-[var(--glow)]/10 text-white uppercase tracking-wider">
                                    Sign in to report
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </>
                )}
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10 w-full">
                {/* Search */}
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--glow)] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search issues, titles, descriptions..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pl-12 pr-10 py-3.5 panel glass !bg-black/40 border border-[var(--border-clean)] rounded-2xl text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--glow)]/50 focus:ring-1 focus:ring-[var(--glow)]/50 transition-all font-medium text-sm md:text-base outline-none"
                    />
                    {filters.search && (
                        <button
                            onClick={() => setFilters({ ...filters, search: '' })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="panel glass border-[var(--border-clean)] hover:border-[var(--glow)]/30 rounded-xl px-4 py-3.5 text-white text-sm font-bold bg-transparent cursor-pointer appearance-none min-w-[140px] outline-none !bg-black/60 focus:ring-0 focus:border-[var(--glow)]/50"
                    >
                        <option value="" className="bg-black text-gray-400">All Categories</option>
                        <option value="POTHOLE" className="bg-black">Pothole</option>
                        <option value="GARBAGE" className="bg-black">Garbage</option>
                        <option value="STREETLIGHT" className="bg-black">Streetlight</option>
                        <option value="WATER_LEAK" className="bg-black">Water Leak</option>
                        <option value="OTHER" className="bg-black">Other</option>
                    </select>
                    
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="panel glass border-[var(--border-clean)] hover:border-[var(--glow)]/30 rounded-xl px-4 py-3.5 text-white text-sm font-bold bg-transparent cursor-pointer appearance-none min-w-[140px] outline-none !bg-black/60 focus:ring-0 focus:border-[var(--glow)]/50"
                    >
                        <option value="" className="bg-black text-gray-400">All Status</option>
                        <option value="REPORTED" className="bg-black">Reported</option>
                        <option value="IN_PROGRESS" className="bg-black">In Progress</option>
                        <option value="RESOLVED" className="bg-black">Resolved</option>
                    </select>

                    <div className="flex panel glass border-[var(--border-clean)] rounded-xl p-1 bg-black/40">
                        <button
                            onClick={() => setView('list')}
                            className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                                view === 'list'
                                    ? 'bg-[var(--glow)]/20 text-[var(--glow)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                            }`}
                            title="List View"
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setView('map')}
                            className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                                view === 'map'
                                    ? 'bg-[var(--glow)]/20 text-[var(--glow)] shadow-sm'
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-white/5'
                            }`}
                            title="Map View"
                        >
                            <MapIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 min-h-[400px] panel glass border-[var(--border-clean)] rounded-[2rem]">
                    <PlayfulLoader text="Fetching the latest citizen reports..." />
                </div>
            ) : issues.length === 0 ? (
                <div className="text-center py-24 px-6 panel glass border-[var(--border-clean)] rounded-[2rem]">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex flex-col items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{resolvedEmptyTitle}</h3>
                    <p className="text-[var(--text-dim)] font-medium max-w-md mx-auto mb-8">
                        {resolvedEmptySubtitle}
                    </p>
                    {showFormToggle && (
                        <SignedIn>
                            <Link
                                to="/submit"
                                className="inline-flex items-center gap-2 font-black px-6 py-3 rounded-xl transition-all panel glass hover:border-[var(--glow)]/50 hover:bg-[var(--glow)]/10 text-white uppercase tracking-wider text-sm border-[var(--glow)]/30"
                            >
                                <Plus className="w-4 h-4" /> Start a Report
                            </Link>
                        </SignedIn>
                    )}
                </div>
            ) : view === 'list' ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {issues.map((issue) => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-12">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-5 py-2.5 panel glass rounded-xl border border-[var(--border-clean)] disabled:opacity-50 text-white text-sm font-bold hover:border-[var(--glow)]/50 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-[var(--text-muted)] font-medium text-sm">
                                Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{pagination.totalPages}</span>
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="px-5 py-2.5 panel glass rounded-xl border border-[var(--border-clean)] disabled:opacity-50 text-white text-sm font-bold hover:border-[var(--glow)]/50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="h-[600px] w-full rounded-[2rem] overflow-hidden panel glass border-[var(--border-clean)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                    <div className="w-full h-full relative z-0">
                        <IssueMap issues={issues} height="100%" />
                    </div>
                </div>
            )}
        </div>
    )
}
