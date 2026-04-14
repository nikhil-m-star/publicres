import { useState } from 'react'
import { MapPin, Filter, Layers, X, Crosshair } from 'lucide-react'
import { useIssues, useAuthSync } from '../hooks/useIssues'
import IssueMap from '../components/IssueMap'

// Constants
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
    const { data, isLoading } = useIssues({ ...filters, limit: 200 })
    const issues = data?.issues || []

    return (
        <div className="h-[calc(100vh-64px)] flex relative overflow-hidden bg-white">
            {/* Map Area */}
            <div className="flex-1 relative z-0 w-full h-full">
                <IssueMap
                    issues={issues}
                    height="100%"
                    showControls={true}
                    showLegend={true}
                    enableClustering={true}
                />
            </div>
            
            {/* Floating Top Floating Filter Bar Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white/90 backdrop-blur-xl border border-gray-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl px-3 py-2 flex items-center gap-3 w-[90%] max-w-2xl">
                <div className="flex-1 relative flex items-center">
                    <MapPin className="absolute left-3 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={filters.city}
                        onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                        placeholder="Search City..."
                        className="w-full pl-9 pr-3 py-2 bg-transparent border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400 font-medium outline-none"
                    />
                </div>
                <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
                <select
                    value={filters.category}
                    onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-700 font-medium outline-none cursor-pointer hidden sm:block appearance-none pl-2"
                >
                    {categories.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
                <div className="w-px h-6 bg-gray-200 hidden md:block"></div>
                <select
                    value={filters.status}
                    onChange={(e) => setFilters((f) => ({ ...f, status: f.status === s.value ? '' : e.target.value }))}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-700 font-medium outline-none cursor-pointer hidden md:block appearance-none pl-2 pr-6"
                >
                    {statuses.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}