import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { Shield, MapPin, Loader2, CheckCircle2, AlertCircle, User, Crown, Mail, Calendar, BarChart3, Star, CheckSquare, Sparkles } from 'lucide-react';

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
                {/* Simplified Header - Always Blue */}
                <div className="bg-civic-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Profile Verification</h1>
                    <p className="text-civic-100 mb-2 font-medium">Auto-recognize your role using your email domain.</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-medium text-white border border-white/20">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Requires a valid bmsce.ac.in email
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {/* Simplified User Card */}
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
                                ) : (
                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-gray-700">{user?.name || 'User'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span>{user?.email || '—'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Verification Actions / Status */}
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
                            </div>
                        </div>
                    ) : roleKey === 'CITIZEN' ? (
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
                    ) : (
                        <div className="space-y-3 pt-2">
                            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center shadow-sm">
                                <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-green-900 mb-1">Account Verified</h3>
                                <p className="text-sm text-green-700">
                                    You are signed in as an official <strong>{roleMeta.label}</strong>.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/admin')}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl active:scale-[0.98]"
                            >
                                <BarChart3 className="w-5 h-5 text-ember-400" />
                                Go to Command Center
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
