import { useState } from 'react'
import { Send, Loader2, User } from 'lucide-react'
import { useAddComment } from '../hooks/useIssues'
import { useUser } from '@clerk/clerk-react'

export default function CommentSection({ issueId, comments = [] }) {
    const [text, setText] = useState('')
    const addComment = useAddComment()
    const { isSignedIn } = useUser()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!text.trim()) return

        await addComment.mutateAsync({ id: issueId, comment: text.trim() })
        setText('')
    }

    return (
        <div className="space-y-5">
            <h3 className="font-semibold text-gray-900">
                Comments{' '}
                <span className="text-sm font-normal text-gray-400">({comments.length})</span>
            </h3>

            {/* Comment form */}
            {isSignedIn && (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add a comment..."
                        className="input-field flex-1"
                    />
                    <button
                        type="submit"
                        disabled={!text.trim() || addComment.isPending}
                        className="btn-primary px-4 disabled:opacity-50"
                    >
                        {addComment.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </form>
            )}

            {/* Comments list */}
            <div className="space-y-3">
                {comments.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No comments yet. Be the first!</p>
                ) : (
                    comments.map((c) => (
                        <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-gray-50/50">
                            <div className="w-8 h-8 rounded-full bg-civic-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-civic-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm font-medium text-gray-900">{c.user?.name || 'User'}</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{c.comment}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
