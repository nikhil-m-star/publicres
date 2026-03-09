import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { Shield, MapPin, Loader2, CheckCircle2, AlertCircle, User, Crown, Mail, Calendar, BarChart3, Star, CheckSquare } from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const queryClient = useQueryClient();
    const { getToken, isSignedIn } = useAuth();

    const meQuery = useQuery({
        queryKey: ['me'],
        enabled: isSignedIn,
        queryFn: async () => {
            const token = await getToken();
            setAuthToken(token);
            return api.getMe();
        },
    });

    const verifyMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            setAuthToken(token);
            return api.verifyByEmail({});
        },
        onSuccess: (data) => {
            setSuccess(true);
            setVerificationResult(data);
            queryClient.invalidateQueries({ queryKey: ['me'] });
            // Revert back and show the updated profile profile after success message briefly
            setTimeout(() => {
                setSuccess(false);
            }, 800);
        },
        onError: (error) => {
            console.error("Verification failed:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
            }
        }
    });

    const user = meQuery.data?.user;
    const roleKey = user?.role || 'CITIZEN';

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    const getRoleMeta = (role) => {
        switch (role) {
            case 'PRESIDENT':
                return {
                    label: 'President',
                    icon: Crown,
                    badge: 'bg-amber-100 text-amber-700 border-amber-200',
                };
            case 'OFFICER':
                return {
                    label: 'Officer',
                    icon: Shield,
                    badge: 'bg-blue-100 text-blue-700 border-blue-200',
                };
            default:
                return {
                    label: 'Citizen',
                    icon: User,
                    badge: 'bg-gray-100 text-gray-700 border-gray-200',
                };
        }
    };

    const roleMeta = getRoleMeta(roleKey);
    const RoleIcon = roleMeta.icon;

    return (
        <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-civic-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Profile Verification</h1>
                    <p className="text-civic-100 mb-2">Your role and area are auto-recognized using your email domain.</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-medium text-white border border-white/20">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Requires a valid bmsce.ac.in email
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-gray-200">
                                <RoleIcon className="w-6 h-6 text-gray-700" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-base font-semibold text-gray-900">User Card</h2>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${roleMeta.badge}`}>
                                        {roleMeta.label}
                                    </span>
                                </div>
                                {meQuery.isLoading ? (
                                    <p className="text-sm text-gray-500 mt-1">Loading profile…</p>
                                ) : meQuery.isError ? (
                                    <p className="text-sm text-red-500 mt-1">Failed to load profile</p>
                                ) : (
                                    <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-gray-700">{user?.name || 'User'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span>{user?.email || '—'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>Joined {formatDate(user?.createdAt)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Section for Officers/Presidents */}
                        {roleKey !== 'CITIZEN' && !meQuery.isLoading && !meQuery.isError && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-ember-500" />
                                    Performance Statistics
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckSquare className="w-3.5 h-3.5 text-green-500" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Resolved</span>
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">{user?.resolvedCount || 0}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Shield className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Assigned</span>
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">{user?.assignedCount || 0}</div>
                                    </div>
                                    <div className="col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700">Service Rating</span>
                                                </div>
                                                <div className="text-2xl font-black text-amber-900">
                                                    {user?.avgRating > 0 ? user.avgRating.toFixed(1) : '5.0'}
                                                    <span className="text-sm font-normal text-amber-700 ml-1">/ 5.0</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= Math.round(user?.avgRating || 5) ? 'text-amber-500 fill-amber-500' : 'text-amber-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {success ? (
                        <div className="text-center animate-fade-in space-y-4 py-4">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                            <h2 className="text-xl font-semibold text-gray-900">Verification Successful</h2>
                            <div className="text-gray-500 space-y-1">
                                <p>Your account has been upgraded successfully.</p>
                                {verificationResult?.assignedRole && (
                                    <p className="text-sm text-gray-600">
                                        Assigned: <span className="font-semibold">{verificationResult.assignedRole}</span>
                                        {verificationResult.assignedArea ? ` · ${verificationResult.assignedArea}` : ''}
                                    </p>
                                )}
                                {verificationResult?.recognized === false && (
                                    <p className="text-xs text-gray-500">No directory match found; default officer access granted.</p>
                                )}
                            </div>
                        </div>
                    ) : roleKey !== 'CITIZEN' ? (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center shadow-sm">
                            <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-green-900 mb-1">Account Verified</h3>
                            <p className="text-sm text-green-700">
                                You are currently signed in as an official <strong>{roleMeta.label}</strong> for <strong>{user?.area || user?.city || 'your region'}</strong>.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                verifyMutation.mutate();
                            }}
                            className="space-y-5"
                        >
                            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-600">
                                <p className="font-medium text-gray-800">Automatic verification</p>
                                <p className="mt-1">If your email matches the officer directory, your role and area will be assigned automatically.</p>
                            </div>

                            {verifyMutation.isError && (
                                <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
                                    {verifyMutation.error?.response?.data?.error || "Verification failed"}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={verifyMutation.isPending}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                            >
                                {verifyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5 text-white/80" />}
                                {verifyMutation.isPending ? 'Verifying...' : 'Verify & Upgrade'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
