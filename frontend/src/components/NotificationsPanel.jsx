import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { api, setAuthToken } from '../api/client'
import { AlertTriangle, ShieldAlert, Loader2, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotificationsPanel({ title = 'Notifications' }) {
    const { getToken, isSignedIn } = useAuth()
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const token = await getToken()
            setAuthToken(token)
            return api.getNotifications()
        },
        refetchInterval: 30000,
        enabled: isSignedIn,
    })

    const markReadMutation = useMutation({
        mutationFn: async (id) => {
            const token = await getToken()
            setAuthToken(token)
            return api.markNotificationRead(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        },
    })

    const notifications = data?.notifications || []
    const unreadCount = data?.unreadCount || 0

    return (
        <div className="card overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {unreadCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                        {unreadCount} unread
                    </span>
                )}
            </div>

            <div className="max-h-[520px] overflow-y-auto w-full">
                {isLoading ? (
                    <div className="p-10 flex justify-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-10 text-center text-gray-500 text-sm">
                        No notifications yet.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`p-5 transition-colors ${notif.isRead ? 'bg-white opacity-80' : 'bg-red-50/30'}`}
                            >
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-0.5">
                                        {notif.issue?.category === 'BRIBERY' ? (
                                            <ShieldAlert className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${notif.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                            {notif.message}
                                        </p>

                                        {notif.issue && (
                                            <Link
                                                to={`/issues/${notif.issueId}`}
                                                className="text-xs text-civic-600 hover:underline mt-1 inline-block font-medium"
                                            >
                                                View Issue #{notif.issue.title.substring(0, 20)}...
                                            </Link>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {!notif.isRead && (
                                        <button
                                            onClick={() => markReadMutation.mutate(notif.id)}
                                            disabled={markReadMutation.isPending}
                                            className="shrink-0 p-1.5 text-civic-500 hover:bg-civic-50 rounded-full transition-colors h-fit"
                                            title="Mark as read"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
