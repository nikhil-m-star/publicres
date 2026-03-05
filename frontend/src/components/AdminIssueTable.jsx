import { useUpdateStatus } from '../hooks/useIssues'
import { Loader2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const statusColors = {
    REPORTED: 'bg-red-50 text-red-700',
    IN_PROGRESS: 'bg-amber-50 text-amber-700',
    RESOLVED: 'bg-emerald-50 text-emerald-700',
}

const categoryLabels = {
    POTHOLE: '🕳️ Pothole',
    GARBAGE: '🗑️ Garbage',
    STREETLIGHT: '💡 Streetlight',
    WATER_LEAK: '💧 Water Leak',
    OTHER: '📋 Other',
}

export default function AdminIssueTable({ issues = [] }) {
    const updateStatus = useUpdateStatus()

    const handleStatusChange = async (issueId, newStatus) => {
        await updateStatus.mutateAsync({ id: issueId, status: newStatus })
    }

    if (issues.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <p>No issues found matching your filters.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Votes</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {issues.map((issue) => (
                        <tr key={issue.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    {issue.imageUrl && (
                                        <img
                                            src={issue.imageUrl}
                                            alt=""
                                            className="w-10 h-10 rounded-lg object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://picsum.photos/seed/${issue.id}/100/100`;
                                            }}
                                        />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{issue.title}</p>
                                        <p className="text-xs text-gray-400">by {issue.createdBy?.name || 'Unknown'}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-sm">{categoryLabels[issue.category]}</span>
                            </td>
                            <td className="py-3 px-4">
                                <select
                                    value={issue.status}
                                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer ${statusColors[issue.status]}`}
                                    disabled={updateStatus.isPending}
                                >
                                    <option value="REPORTED">Reported</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                </select>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-sm font-medium text-gray-700">{issue.votes}</span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-xs text-gray-400">
                                    {new Date(issue.createdAt).toLocaleDateString()}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <Link
                                    to={`/issues/${issue.id}`}
                                    className="text-civic-600 hover:text-civic-700 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
