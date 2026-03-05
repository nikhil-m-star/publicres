import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Bell, Check, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['notifications'],
        queryFn: api.getNotifications,
        retry: false, // If it fails (403 for citizens), don't retry
        refetchInterval: (query) => query.state.status === 'error' ? false : 30000, // Only poll if successful
    });

    const markReadMutation = useMutation({
        mutationFn: api.markNotificationRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    if (isError) return null;

    const notifications = data?.notifications || [];
    const unreadCount = data?.unreadCount || 0;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 focus:outline-none"
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">Admin Alerts</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                    {unreadCount} unread
                                </span>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto w-full">
                            {isLoading ? (
                                <div className="p-8 flex justify-center text-gray-400">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    No notifications.
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map(notif => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 transition-colors ${notif.isRead ? 'bg-white opacity-70' : 'bg-red-50/30'}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="shrink-0 mt-0.5">
                                                    {notif.issue?.category === "BRIBERY"
                                                        ? <ShieldAlert className="w-5 h-5 text-red-500" />
                                                        : <AlertTriangle className="w-5 h-5 text-orange-500" />
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${notif.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                                        {notif.message}
                                                    </p>

                                                    {notif.issue && (
                                                        <Link
                                                            to={`/issues/${notif.issueId}`}
                                                            onClick={() => setIsOpen(false)}
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
                </>
            )}
        </div>
    );
}
