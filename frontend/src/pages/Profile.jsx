import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { Shield, MapPin, Loader2, CheckCircle2, AlertCircle, User, Crown, Mail } from 'lucide-react';

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
            return api.verifyByEmail();
        },
        onSuccess: (data) => {
            setSuccess(true);
            setVerificationResult(data);
            queryClient.invalidateQueries({ queryKey: ['me'] }); // if applicable, to hard-refresh user state
            // Use client-side routing instead of full page reload
            setTimeout(() => navigate('/admin'), 2000);
        }
    });

    const user = meQuery.data?.user;
    const roleKey = user?.role || 'CITIZEN';
    const roleMeta = {
        CITIZEN: { label: 'Citizen', badge: 'bg-gray-100 text-gray-700 border-gray-200', icon: User },
        OFFICER: { label: 'Officer', badge: 'bg-blue-50 text-blue-700 border-blue-200', icon: Shield },
        PRESIDENT: { label: 'President', badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: Crown },
    }[roleKey] || { label: 'Citizen', badge: 'bg-gray-100 text-gray-700 border-gray-200', icon: User };
    const RoleIcon = roleMeta.icon;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
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
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span>{user?.area || (roleKey === 'OFFICER' ? 'Unassigned' : '—')}</span>
                                        </div>
                                        {roleKey !== 'CITIZEN' && (
                                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg">
                                                    <span className="font-semibold text-sm">⭐ Overall Rating:</span>
                                                    <span className="font-bold text-sm">{user?.avgRating > 0 ? user.avgRating.toFixed(1) : 'No ratings yet'}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {success ? (
                        <div className="text-center animate-fade-in space-y-4 py-4">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                            <h2 className="text-xl font-semibold text-gray-900">Verification Successful</h2>
                            <div className="text-gray-500 space-y-1">
                                <p>Your account has been upgraded. Redirecting to Admin Panel...</p>
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
                                {verifyMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                                Verify & Upgrade
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
