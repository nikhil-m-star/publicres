import { useState } from 'react'
import { MapPin, Filter, Layers, X, ChevronDown, Crosshair } from 'lucide-react'
import { useIssues, useAuthSync } from '../hooks/useIssues'
import IssueMap from '../components/IssueMap'
import IssueCard from '../components/IssueCard'
import { PlayfulLoader } from '../components/ui/Loading'

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
        <div className="h-[calc(100vh-64px)] flex relative overflow-hidden">
            {/* Sidebar */}
            {showSidebar && (
                <div className={`w-full sm:w-[400px] panel glass lg:!bg-black/20 lg:!backdrop-blur-md lg:!border-r lg:!border-white/10 lg:!shadow-none flex flex-col z-40 transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:hidden'} absolute lg:relative h-full left-0 top-0`}>
                    <div className={`flex flex-col h-full transition-opacity duration-300 delay-150 ${showSidebar ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-black/20">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black bg-gradient-to-r hover:scale-105 transition-transform from-blue-400 to-teal-300 text-transparent bg-clip-text flex items-center gap-3">
                                    <span className="p-2 panel glass rounded-xl"><MapPin className="w-5 h-5 text-teal-300" /></span>
                                    Namma Map
                                </h2>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`p-3 rounded-2xl transition-all panel ${showFilters ? 'glass ring-1 ring-teal-500/50 text-teal-300' : 'hover:glass text-[var(--text-muted)] hover:text-white'}`}
                                >
                                    <Filter className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Stats bar */}
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                <div className="flex flex-col items-center justify-center panel glass rounded-xl py-3 border border-white/5 hover:border-white/20 transition-colors">
                                    <p className="text-xl font-black text-white">{counts.total}</p>
                                    <p className="text-[9px] text-white/40 font-black tracking-widest mt-1">ALL</p>
                                </div>
                                <div className="flex flex-col items-center justify-center panel glass !bg-red-500/10 rounded-xl py-3 border border-red-500/20 hover:border-red-500/40 transition-colors">
                                    <p className="text-xl font-black text-red-400">{counts.reported}</p>
                                    <p className="text-[9px] text-red-400/50 font-black tracking-widest mt-1">OPEN</p>
                                </div>
                                <div className="flex flex-col items-center justify-center panel glass !bg-amber-500/10 rounded-xl py-3 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                                    <p className="text-xl font-black text-amber-400">{counts.inProgress}</p>
                                    <p className="text-[9px] text-amber-400/50 font-black tracking-widest mt-1">DOING</p>
                                </div>
                                <div className="flex flex-col items-center justify-center panel glass !bg-emerald-500/10 rounded-xl py-3 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                                    <p className="text-xl font-black text-emerald-400">{counts.resolved}</p>
                                    <p className="text-[9px] text-emerald-400/50 font-black tracking-widest mt-1">DONE</p>
                                </div>
                            </div>

                            {/* Filters */}
                            {showFilters && (
                                <div className="mt-4 space-y-3 animate-slide-pop">
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-teal-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={filters.city}
                                            onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                                            placeholder="City (e.g. Bengaluru)"
                                            className="w-full pl-11 pr-4 py-3.5 panel glass !bg-black/40 border border-white/5 rounded-xl focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-sm text-white placeholder-white/30 font-medium"
                                        />
                                    </div>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                                        className="w-full px-4 py-3.5 panel glass !bg-black/40 border border-white/5 rounded-xl focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-sm text-white appearance-none cursor-pointer font-medium"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.value} value={c.value} className="bg-black text-white">{c.label}</option>
                                        ))}
                                    </select>
                                    <div className="flex gap-2 p-1 panel glass rounded-xl">
                                        {statuses.map((s) => (
                                            <button
                                                key={s.value}
                                                onClick={() => setFilters((f) => ({ ...f, status: f.status === s.value ? '' : s.value }))}
                                                className={`flex-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all ${filters.status === s.value
                                                    ? 'bg-teal-500/20 text-teal-300 shadow-[0_0_15px_rgba(0,255,255,0.1)]'
                                                    : 'text-white/40 hover:text-white hover:bg-white/5'
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
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide pb-20">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <PlayfulLoader text="Loading issues..." />
                                </div>
                            ) : issues.length === 0 ? (
                                <div className="text-center py-12 text-[var(--text-muted)]">
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
                </div>
            )}

            {/* Toggle sidebar button */}
            <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="absolute top-6 left-6 z-[50] panel glass p-3.5 rounded-2xl shadow-xl border border-white/10 text-white hover:scale-105 active:scale-95 transition-all lg:hidden"
            >
                {showSidebar ? <X className="w-6 h-6 text-red-400 drop-shadow-md" /> : <Layers className="w-6 h-6 text-teal-300 drop-shadow-md" />}
            </button>

            {/* Map */}
            <div className="flex-1 relative z-0">
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