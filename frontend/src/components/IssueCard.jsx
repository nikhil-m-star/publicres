import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, ThumbsUp, Clock, CircleDot, Trash2, Lightbulb, Droplets, FileText } from 'lucide-react'

const categoryColors = {
    POTHOLE: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    GARBAGE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    STREETLIGHT: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    WATER_LEAK: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    OTHER: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
}

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
    const catColor = categoryColors[issue.category] || categoryColors.OTHER
    const CatIcon = categoryIcons[issue.category] || FileText
    const timeAgo = getTimeAgo(issue.createdAt)

    return (
        <Link to={`/issues/${issue.id}`} className="block">
            <div className="card glass p-0 overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform duration-300">
                {/* Image */}
                {issue.imageUrl && (
                    <div className="relative h-44 overflow-hidden">
                        <img
                            src={issue.imageUrl}
                            alt={issue.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://picsum.photos/seed/${issue.id}/800/600`;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <span
                            className={`absolute top-3 right-3 status-badge ${issue.status === 'REPORTED'
                                ? 'status-reported'
                                : issue.status === 'IN_PROGRESS'
                                    ? 'status-in_progress'
                                    : 'status-resolved'
                                }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${issue.status === 'REPORTED'
                                    ? 'bg-red-500'
                                    : issue.status === 'IN_PROGRESS'
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                    }`}
                            />
                            {statusLabels[issue.status]}
                        </span>
                    </div>
                )}

                <div className="p-5">
                    {/* Category + Status (no image) */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className={`category-badge ${catColor.bg} ${catColor.text} border ${catColor.border}`}>
                                <CatIcon className="w-3.5 h-3.5" />
                                {categoryLabels[issue.category]}
                            </span>
                            {issue.area && (
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {issue.area}
                                </span>
                            )}
                        </div>
                        {!issue.imageUrl && (
                            <span
                                className={`status-badge ${issue.status === 'REPORTED'
                                    ? 'status-reported'
                                    : issue.status === 'IN_PROGRESS'
                                        ? 'status-in_progress'
                                        : 'status-resolved'
                                    }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${issue.status === 'REPORTED'
                                        ? 'bg-red-500'
                                        : issue.status === 'IN_PROGRESS'
                                            ? 'bg-amber-500'
                                            : 'bg-emerald-500'
                                        }`}
                                />
                                {statusLabels[issue.status]}
                            </span>
                        )}
                    </div>

                    {/* Title + Desc */}
                    <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-civic-700 transition-colors">
                        {issue.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{issue.description}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                {issue.votes || issue._count?.voteRecords || 0}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {issue._count?.comments || 0}
                            </span>
                        </div>
                        <span className="flex items-center gap-1">
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
