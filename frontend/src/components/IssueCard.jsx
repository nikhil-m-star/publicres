import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, ThumbsUp, Clock, CircleDot, Trash2, Lightbulb, Droplets, FileText } from 'lucide-react'

const categoryIcons = {
    POTHOLE: CircleDot,
    GARBAGE: Trash2,
    STREETLIGHT: Lightbulb,
    WATER_LEAK: Droplets,
    OTHER: FileText,
}

const categoryLabels = {
    POTHOLE: 'Pothole',
    GARBAGE: 'Garbage',
    STREETLIGHT: 'Streetlight',
    WATER_LEAK: 'Water Leak',
    OTHER: 'Other',
}

const statusLabels = {
    REPORTED: 'Reported',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
}

export default function IssueCard({ issue }) {
    const CatIcon = categoryIcons[issue.category] || FileText
    const timeAgo = getTimeAgo(issue.createdAt)

    const catClass = `category-${issue.category.toLowerCase()}`
    const statusClass = `status-${issue.status.toLowerCase()}`

    return (
        <Link to={`/issues/${issue.id}`} className="block">
            <div className="card glass p-0 overflow-hidden group cursor-pointer">
                {/* Image */}
                {issue.imageUrl && (
                    <div className="relative h-44 overflow-hidden">
                        <img
                            src={issue.imageUrl}
                            alt={issue.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://picsum.photos/seed/${issue.id}/800/600`;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className={`absolute top-4 right-4 status-badge ${statusClass}`}>
                            <div className="status-dot" />
                            {statusLabels[issue.status]}
                        </span>
                    </div>
                )}

                <div className="p-6">
                    {/* Category + Status (no image) */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border bg-black/40 shadow-sm transition-all hover:scale-105 ${catClass}`}>
                                <CatIcon className="w-3.5 h-3.5" />
                                {categoryLabels[issue.category]}
                            </span>
                            {issue.area && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide border border-[var(--border-clean)] bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors">
                                    <MapPin className="w-3 h-3" />
                                    {issue.area}
                                </span>
                            )}
                        </div>
                        {!issue.imageUrl && (
                            <span className={`status-badge ${statusClass}`}>
                                <div className="status-dot" />
                                {statusLabels[issue.status]}
                            </span>
                        )}
                    </div>

                    {/* Title + Desc */}
                    <h3 className="mb-2 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                        {issue.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-6 leading-relaxed">
                        {issue.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-dim)] font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                {issue.votes || issue._count?.voteRecords || 0}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {issue._count?.comments || 0}
                            </span>
                        </div>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {timeAgo}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

function getTimeAgo(dateStr) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
}
