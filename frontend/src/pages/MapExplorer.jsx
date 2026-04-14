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
        <div className="h-screen w-full flex flex-col relative overflow-hidden bg-black pt-[80px]">
            {/* Map Area */}
            <div className="flex-1 relative z-0 w-full h-full min-h-[500px]">
                <IssueMap
                    issues={issues}
                    height="100%"
                    showControls={true}
                    showLegend={true}
                    enableClustering={true}
                />
            </div>
            
            {/* Floating Top Filter Bar Overlay */}
            <div className="absolute top-[100px] left-1/2 -translate-x-1/2 z-[400] panel glass !bg-black/60 border border-[var(--border-clean)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] rounded-2xl px-4 py-3 flex items-center gap-4 w-[90%] max-w-3xl transition-all">
                <div className="flex-1 relative flex items-center">
                    <MapPin className="absolute left-4 w-5 h-5 text-[var(--glow)]" />
                    <input
                        type="text"
                        value={filters.city}
                        onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                        placeholder="Search City..."
                        className="w-full pl-11 pr-4 py-2 bg-transparent border-none text-white focus:ring-0 text-sm md:text-base font-bold placeholder-gray-500 outline-none"
                    />
                </div>
                
                <div className="w-px h-8 bg-[var(--border-clean)] hidden sm:block"></div>
                
                <select
                    value={filters.category}
                    onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base text-gray-300 font-bold outline-none cursor-pointer hidden sm:block appearance-none pr-8 !bg-black/80"
                >
                    {categories.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
                
                <div className="w-px h-8 bg-[var(--border-clean)] hidden md:block"></div>
                
                <select
                    value={filters.status}
                    onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base text-gray-300 font-bold outline-none cursor-pointer hidden md:block appearance-none pr-8 !bg-black/80"
                >
                    {statuses.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}
