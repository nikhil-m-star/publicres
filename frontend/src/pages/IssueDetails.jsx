import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ThumbsUp, MapPin, Calendar, User, Loader2, Star, Shield } from 'lucide-react'
import { useIssue, useVoteIssue, useRateOfficer, useAuthSync } from '../hooks/useIssues'
import { useUser } from '@clerk/clerk-react'
import { useState } from 'react'
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

function RatingDialog({ issue, onClose }) {
    const [score, setScore] = useState(0)
    const [hover, setHover] = useState(0)
    const [feedback, setFeedback] = useState('')
    const rateMutation = useRateOfficer()

    const officerName = issue.resolvedBy?.name || issue.assignedTo?.name || 'Officer'

    const handleSubmit = () => {
        if (score === 0) return
        rateMutation.mutate(
            { id: issue.id, score, feedback: feedback.trim() || undefined },
            { onSuccess: onClose }
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Rate the Officer</h3>
                <p className="text-sm text-gray-500 mb-5">How well did <strong>{officerName}</strong> resolve this issue?</p>

                {/* Stars */}
                <div className="flex justify-center gap-1.5 mb-5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <button
                            key={i}
                            onClick={() => setScore(i)}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-10 h-10 transition-colors ${i <= (hover || score)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-gray-200'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                <p className="text-center text-sm text-gray-500 mb-4">
                    {score === 1 && '😞 Poor'}
                    {score === 2 && '😐 Below Average'}
                    {score === 3 && '🙂 Average'}
                    {score === 4 && '😊 Good'}
                    {score === 5 && '🌟 Excellent'}
                </p>

                {/* Feedback */}
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Optional feedback..."
                    rows={2}
                    className="input-field resize-none text-sm mb-4"
                />

                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={score === 0 || rateMutation.isPending}
                        className="flex-1 btn-primary text-sm disabled:opacity-50"
                    >
                        {rateMutation.isPending ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function IssueDetails() {
    useAuthSync()
    const { id } = useParams()
    const { data: issue, isLoading, isError } = useIssue(id)
    const voteIssue = useVoteIssue()
    const { isSignedIn, user: clerkUser } = useUser()
    const [showRating, setShowRating] = useState(false)

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
                <Link to="/#reports" className="btn-primary">Back to Reports</Link>
            </div>
        )
    }

    const handleVote = () => {
        if (isSignedIn) voteIssue.mutate(id)
    }

    // Check if current user is the reporter and issue is resolved and not yet rated
    const isReporter = isSignedIn && issue.createdBy?.id && clerkUser
    const canRate = issue.status === 'RESOLVED' && isReporter && (!issue.ratings || issue.ratings.length === 0)
    const existingRating = issue.ratings?.find((r) => r.givenBy?.id === issue.createdBy?.id)

    return (
        <div className="page-container max-w-4xl">
            {/* Back */}
            <Link
                to="/#reports"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Reports
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image */}
                    {issue.imageUrl && (
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                            <img src={issue.imageUrl} alt={issue.title} className="w-full h-72 object-cover" />
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
                                year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                        </span>
                    </div>

                    {/* Assigned officer */}
                    {issue.assignedTo && (
                        <div className="card p-4 flex items-center gap-3 bg-blue-50/50 border-blue-100">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Assigned to: {issue.assignedTo.name}</p>
                                {issue.assignedTo.area && (
                                    <p className="text-xs text-gray-500">{issue.assignedTo.area} • Rating: {issue.assignedTo.avgRating?.toFixed(1) || '—'} ⭐</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Status Timeline */}
                    <div className="card p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Status Progress</h3>
                        <StatusTimeline currentStatus={issue.status} />
                    </div>

                    {/* Rating prompt for resolved issues */}
                    {canRate && (
                        <div className="card p-5 bg-amber-50/50 border-amber-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">🎉 This issue has been resolved!</h3>
                                    <p className="text-sm text-gray-500">Rate the officer who handled your issue to help improve civic services.</p>
                                </div>
                                <button onClick={() => setShowRating(true)} className="btn-primary text-sm whitespace-nowrap">
                                    <Star className="w-4 h-4 inline mr-1" />
                                    Rate Officer
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Show existing rating */}
                    {existingRating && (
                        <div className="card p-4 bg-emerald-50/50 border-emerald-100">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className={`w-4 h-4 ${i <= existingRating.score ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">Your rating submitted. Thank you!</span>
                            </div>
                        </div>
                    )}

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
                        {!isSignedIn && <p className="text-xs text-gray-400 mt-2">Sign in to vote</p>}
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

            {/* Rating dialog */}
            {showRating && <RatingDialog issue={issue} onClose={() => setShowRating(false)} />}
        </div>
    )
}
