import { useState } from 'react'
import { Trophy, Star, Award, Users, TrendingUp, ChevronDown } from 'lucide-react'
import { useLeaderboard, useRateOfficerGeneral } from '../hooks/useIssues'
import { useUser } from '@clerk/clerk-react'

const StarRating = ({ rating, size = 'sm' }) => {
    const full = Math.floor(rating)
    const half = rating - full >= 0.5
    const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={`${sizeClass} ${i <= full
                        ? 'text-amber-400 fill-amber-400'
                        : i === full + 1 && half
                            ? 'text-amber-400 fill-amber-200'
                            : 'text-gray-200'
                        }`}
                />
            ))}
            <span className={`ml-1 font-semibold ${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-600`}>
                {rating > 0 ? rating.toFixed(1) : '—'}
            </span>
        </div>
    )
}

const roleColors = {
    PRESIDENT: 'bg-purple-100 text-purple-700 border-purple-200',
    OFFICER: 'bg-blue-100 text-blue-700 border-blue-200',
}

const roleTitles = {
    PRESIDENT: '👑 President',
    OFFICER: '🛡️ Officer',
}

function GeneralRatingDialog({ officer, onClose }) {
    const [score, setScore] = useState(0)
    const [hover, setHover] = useState(0)
    const [feedback, setFeedback] = useState('')
    const rateMutation = useRateOfficerGeneral()

    const handleSubmit = () => {
        if (score === 0) return
        rateMutation.mutate(
            { id: officer.id, score, feedback: feedback.trim() || undefined },
            { onSuccess: onClose }
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Rate Officer</h3>
                <p className="text-sm text-gray-500 mb-5">Leave a rating for <strong>{officer.name}</strong> based on their overall civic service.</p>

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

export default function Leaderboard() {
    const { data, isLoading } = useLeaderboard()
    const { isSignedIn } = useUser()
    const [tab, setTab] = useState('officers')
    const [selectedOfficerForRating, setSelectedOfficerForRating] = useState(null)

    const officers = data?.officers || []
    const citizens = data?.citizens || []

    if (isLoading) {
        return (
            <div className="page-container py-20 text-center">
                <div className="w-8 h-8 border-2 border-civic-200 border-t-civic-600 rounded-full animate-spin mx-auto" />
            </div>
        )
    }

    return (
        <div className="page-container py-8">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-4">
                    <Trophy className="w-4 h-4" />
                    Community Leaderboard
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    Bengaluru's Civic Champions
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Recognizing officers and citizens who are making Bengaluru better, one issue at a time.
                </p>
            </div>

            {/* Tab switch */}
            <div className="flex justify-center gap-2 mb-8">
                <button
                    onClick={() => setTab('officers')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'officers'
                        ? 'bg-civic-600 text-white shadow-lg shadow-civic-500/25'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                >
                    <Award className="w-4 h-4 inline mr-1.5" />
                    Officers & President
                </button>
                <button
                    onClick={() => setTab('citizens')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'citizens'
                        ? 'bg-civic-600 text-white shadow-lg shadow-civic-500/25'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                >
                    <Users className="w-4 h-4 inline mr-1.5" />
                    Citizens
                </button>
            </div>

            {/* Officers Table */}
            {tab === 'officers' && (
                <div className="card overflow-hidden">
                    {officers.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No officers yet</p>
                            <p className="text-sm mt-1">Officers will appear here once assigned by the President</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100">
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Area</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resolved</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {officers.map((officer, i) => (
                                        <tr key={officer.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' :
                                                    i === 1 ? 'bg-gray-100 text-gray-600' :
                                                        i === 2 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-gray-50 text-gray-400'
                                                    }`}>
                                                    {i + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">{officer.name}</p>
                                                <p className="text-xs text-gray-400">{officer.totalRatings} rating{officer.totalRatings !== 1 ? 's' : ''}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${roleColors[officer.role]}`}>
                                                    {roleTitles[officer.role]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {officer.area || '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StarRating rating={officer.avgRating} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-gray-900">{officer.resolvedCount}</span>
                                                <span className="text-xs text-gray-400 ml-1">/ {officer.assignedCount} assigned</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {isSignedIn ? (
                                                    <button
                                                        onClick={() => setSelectedOfficerForRating(officer)}
                                                        className="text-xs font-semibold text-civic-600 hover:text-civic-800 bg-civic-50 hover:bg-civic-100 px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        Rate
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400" title="Sign in to rate">Sign in</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Citizens Table */}
            {tab === 'citizens' && (
                <div className="card overflow-hidden">
                    {citizens.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No citizens yet</p>
                            <p className="text-sm mt-1">Citizens who report issues will appear here</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100">
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Issues Reported</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Votes Cast</th>
                                        <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Comments</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {citizens.map((citizen, i) => (
                                        <tr key={citizen.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' :
                                                    i === 1 ? 'bg-gray-100 text-gray-600' :
                                                        i === 2 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-gray-50 text-gray-400'
                                                    }`}>
                                                    {i + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">{citizen.name}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-700">{citizen._count.issues}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{citizen._count.votes}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{citizen._count.comments}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Rating Modal */}
            {selectedOfficerForRating && (
                <GeneralRatingDialog
                    officer={selectedOfficerForRating}
                    onClose={() => setSelectedOfficerForRating(null)}
                />
            )}
        </div>
    )
}
