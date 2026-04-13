import { useState } from 'react'
import { MapPin, Filter, Layers, X, ChevronDown, Crosshair } from 'lucide-react'
import { useIssues, useAuthSync } from '../hooks/useIssues'
import IssueMap from '../components/IssueMap'
import IssueCard from '../components/IssueCard'

const categories = [
    { value: '', label: 'All Categories' },
    { value: 'POTHOLE', label: 'Pothole' },
    { value: 'GARBAGE', label: 'Garbage' },
    { value: 'STREETLIGHT', label: 'Streetlight' },
    { value: 'WATER_LEAK', label: 'Water Leak' },
    { value: 'OTHER', label: 'Other' },
]

const statuses = [
    { value: '', label: 'All Status' },
    { value: 'REPORTED', label: 'Reported', color: 'bg-red-500' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-500' },
    { value: 'RESOLVED', label: 'Resolved', color: 'bg-emerald-500' },
]

export default function MapExplorer() {
    useAuthSync()

    const [filters, setFilters] = useState({ category: '', status: '', city: 'Bengaluru' })
    const [showFilters, setShowFilters] = useState(false)
    const [selectedIssue, setSelectedIssue] = useState(null)
    const [showSidebar, setShowSidebar] = useState(true)

    const { data, isLoading } = useIssues({ ...filters, limit: 200 })
    const issues = data?.issues || []

    const counts = {
        total: issues.length,
        reported: issues.filter((i) => i.status === 'REPORTED').length,
        inProgress: issues.filter((i) => i.status === 'IN_PROGRESS').length,
        resolved: issues.filter((i) => i.status === 'RESOLVED').length,
    }

    return (
        <div className="h-[calc(100vh-64px)] flex relative">
            {/* Sidebar */}
            {showSidebar && (
                <div className={`w-96 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-10 shadow-lg ${showSidebar ? 'flex' : 'hidden'} absolute lg:relative h-full left-0`}>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-civic-600" />
                                Issue Map
                            </h2>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-civic-50 text-civic-700' : 'hover:bg-gray-50 text-gray-500'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Stats bar */}
                        <div className="flex gap-2">
                            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-center">
                                <p className="text-lg font-bold text-gray-900">{counts.total}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total</p>
                            </div>
                            <div className="flex-1 bg-red-50 rounded-lg px-3 py-2 text-center">
                                <p className="text-lg font-bold text-red-600">{counts.reported}</p>
                                <p className="text-[10px] text-red-500 uppercase tracking-wider">Open</p>
                            </div>
                            <div className="flex-1 bg-amber-50 rounded-lg px-3 py-2 text-center">
                                <p className="text-lg font-bold text-amber-600">{counts.inProgress}</p>
                                <p className="text-[10px] text-amber-500 uppercase tracking-wider">Active</p>
                            </div>
                            <div className="flex-1 bg-emerald-50 rounded-lg px-3 py-2 text-center">
                                <p className="text-lg font-bold text-emerald-600">{counts.resolved}</p>
                                <p className="text-[10px] text-emerald-500 uppercase tracking-wider">Done</p>
                            </div>
                        </div>

                        {/* Filters */}
                        {showFilters && (
                            <div className="mt-3 space-y-2 animate-fade-in">
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={filters.city}
                                        onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                                        placeholder="City (e.g. Bengaluru)"
                                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-civic-500 focus:ring-4 focus:ring-civic-500/10 outline-none transition-all text-sm mb-2"
                                    />
                                </div>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                                    className="input-field text-sm py-2"
                                >
                                    {categories.map((c) => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                                <div className="flex gap-2">
                                    {statuses.map((s) => (
                                        <button
                                            key={s.value}
                                            onClick={() => setFilters((f) => ({ ...f, status: f.status === s.value ? '' : s.value }))}
                                            className={`flex-1 text-xs font-medium py-2 rounded-lg border transition-all ${filters.status === s.value
                                                ? 'bg-civic-50 border-civic-300 text-civic-700'
                                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Issue list */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-6 h-6 border-2 border-civic-200 border-t-civic-600 rounded-full animate-spin" />
                            </div>
                        ) : issues.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No issues found</p>
                            </div>
                        ) : (
                            issues.map((issue) => (
                                <IssueCard key={issue.id} issue={issue} />
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Toggle sidebar button */}
            <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="absolute top-4 left-4 z-[1000] bg-[#111111] p-2.5 rounded-xl shadow-lg border border-white/5 text-white"
            >
                {showSidebar ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </button>

            {/* Map */}
            <div className="flex-1 relative">
                <IssueMap
                    issues={issues}
                    height="100%"
                    showControls={true}
                    showLegend={true}
                    enableClustering={true}
                />
            </div>
        </div>
    )
}
