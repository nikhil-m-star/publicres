import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ThumbsUp, MapPin, Calendar, User, Loader2 } from 'lucide-react'
import { useIssue, useVoteIssue, useAuthSync } from '../hooks/useIssues'
import { useUser } from '@clerk/clerk-react'
import StatusTimeline from '../components/StatusTimeline'
import CommentSection from '../components/CommentSection'
import IssueMap from '../components/IssueMap'

const categoryLabels = {
    POTHOLE: '🕳️ Pothole',
    GARBAGE: '🗑️ Garbage',
    STREETLIGHT: '💡 Streetlight',
    WATER_LEAK: '💧 Water Leak',
    OTHER: '📋 Other',
}

export default function IssueDetails() {
    useAuthSync()
    const { id } = useParams()
    const { data: issue, isLoading, isError } = useIssue(id)
    const voteIssue = useVoteIssue()
    const { isSignedIn } = useUser()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-3 border-civic-200 border-t-civic-600 rounded-full animate-spin" />
            </div>
        )
    }

    if (isError || !issue) {
        return (
            <div className="page-container text-center py-20">
                <p className="text-gray-500 mb-4">Issue not found</p>
                <Link to="/dashboard" className="btn-primary">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    const handleVote = () => {
        if (isSignedIn) voteIssue.mutate(id)
    }

    return (
        <div className="page-container max-w-4xl">
            {/* Back */}
            <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image */}
                    {issue.imageUrl && (
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={issue.imageUrl}
                                alt={issue.title}
                                className="w-full h-72 object-cover"
                            />
                        </div>
                    )}

                    {/* Title + Meta */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="category-badge bg-gray-100 text-gray-700 border border-gray-200">
                                {categoryLabels[issue.category]}
                            </span>
                            {issue.department && (
                                <span className="category-badge bg-purple-50 text-purple-700 border border-purple-200">
                                    {issue.department}
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{issue.title}</h1>
                        <p className="text-gray-600 leading-relaxed">{issue.description}</p>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            {issue.createdBy?.name || 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(issue.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                        </span>
                    </div>

                    {/* Status Timeline */}
                    <div className="card p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Status Progress</h3>
                        <StatusTimeline currentStatus={issue.status} />
                    </div>

                    {/* Comments */}
                    <div className="card p-6">
                        <CommentSection issueId={issue.id} comments={issue.comments || []} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    {/* Vote card */}
                    <div className="card p-6 text-center">
                        <p className="text-3xl font-bold text-gray-900 mb-1">{issue.votes}</p>
                        <p className="text-sm text-gray-500 mb-4">Upvotes</p>
                        <button
                            onClick={handleVote}
                            disabled={!isSignedIn || voteIssue.isPending}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${issue.hasVoted
                                    ? 'bg-civic-50 text-civic-700 border border-civic-200 hover:bg-civic-100'
                                    : 'btn-primary'
                                } disabled:opacity-50`}
                        >
                            {voteIssue.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <ThumbsUp className={`w-4 h-4 ${issue.hasVoted ? 'fill-current' : ''}`} />
                            )}
                            {issue.hasVoted ? 'Voted' : 'Upvote'}
                        </button>
                        {!isSignedIn && (
                            <p className="text-xs text-gray-400 mt-2">Sign in to vote</p>
                        )}
                    </div>

                    {/* Location map */}
                    <div className="card overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900 text-sm">Location</h3>
                        </div>
                        <IssueMap
                            issues={[issue]}
                            center={[issue.latitude, issue.longitude]}
                            zoom={15}
                            height="220px"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
