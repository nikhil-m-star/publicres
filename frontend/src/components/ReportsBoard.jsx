import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { Plus, List, Map as MapIcon, X, Search } from 'lucide-react'
import { useIssuesScope, useAuthSync } from '../hooks/useIssues'
import IssueCard from './IssueCard'
import IssueForm from './IssueForm'
import IssueMap from './IssueMap'

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
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>
                </div>
                {showFormToggle && (
                    <>
                        <SignedIn>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all ${showForm
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'btn-primary'
                                    }`}
                            >
                                {showForm ? (
                                    <>
                                        <X className="w-4 h-4" /> Close Form
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" /> Report Issue
                                    </>
                                )}
                            </button>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="btn-primary text-sm">Sign in to report</button>
                            </SignInButton>
                        </SignedOut>
                    </>
                )}
            </div>

            {/* Report Form */}
            <SignedIn>
                {showFormToggle && showForm && (
                    <div className="card p-6 mb-8 animate-slide-up">
                        <h3 className="text-lg font-semibold text-gray-900 mb-5">Report a New Issue</h3>
                        <IssueForm onSuccess={() => setShowForm(false)} />
                    </div>
                )}
            </SignedIn>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                {/* Search */}
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

                {/* Category filter */}
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

                {/* Status filter */}
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

                {/* View toggle */}
                <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => setView('list')}
                        className={`px-3 py-2.5 transition-colors ${view === 'list' ? 'bg-civic-50 text-civic-700' : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView('map')}
                        className={`px-3 py-2.5 transition-colors ${view === 'map' ? 'bg-civic-50 text-civic-700' : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <MapIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-3 border-civic-200 border-t-civic-600 rounded-full animate-spin" />
                </div>
            ) : view === 'map' ? (
                <IssueMap issues={issues} height="550px" />
            ) : (
                <>
                    {issues.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <MapIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">{resolvedEmptyTitle}</p>
                            <p className="text-sm mt-1">{resolvedEmptySubtitle}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {issues.map((issue) => (
                                <IssueCard key={issue.id} issue={issue} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn-secondary text-sm disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-500 px-4">
                                Page {page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                disabled={page === pagination.pages}
                                className="btn-secondary text-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
