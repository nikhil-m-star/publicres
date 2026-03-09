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
                {/* Header - Changes based on role */}
                {roleKey === 'CITIZEN' && !success ? (
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
                ) : (
                    <div className="bg-gray-900 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ember-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-civic-500/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700 shadow-lg">
                            <RoleIcon className={`w-8 h-8 ${roleKey === 'CITIZEN' ? 'text-gray-400' : 'text-ember-400'}`} />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            {roleKey === 'CITIZEN' ? 'User Profile' : 'Account Dashboard'}
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            {roleKey === 'CITIZEN' ? 'Citizen Account' : `${roleMeta.label} Status Active`}
                        </p>
                    </div>
                )}

                <div className="p-8 space-y-6">
                    {/* User Identity Details Card */}
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden">
                                {isSignedIn ? (
                                    <img
                                        src={user?.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-7 h-7 text-gray-300" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-lg font-bold text-gray-900">{user?.name || 'User'}</h2>
                                    <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md border ${roleMeta.badge}`}>
                                        {roleMeta.label}
                                    </span>
                                </div>
                                {meQuery.isLoading ? (
                                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                                ) : (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span>{user?.email || 'No email provided'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Member since {formatDate(user?.createdAt)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Performance Dashboard for Verified Roles */}
                        {roleKey !== 'CITIZEN' && !meQuery.isLoading && (
                            <div className="mt-6 pt-6 border-t border-gray-200/60">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                        <BarChart3 className="w-3.5 h-3.5 text-ember-500" />
                                        Performance Stats
                                    </h3>
                                    <div className="text-[10px] font-bold text-ember-600 bg-ember-50 px-2 py-0.5 rounded-full border border-ember-100 uppercase">
                                        Official Data
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center">
                                                <CheckSquare className="w-3.5 h-3.5 text-green-600" />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">Resolved</span>
                                        </div>
                                        <div className="text-2xl font-black text-gray-900 leading-none">{user?.resolvedCount || 0}</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <Shield className="w-3.5 h-3.5 text-blue-600" />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">Assigned</span>
                                        </div>
                                        <div className="text-2xl font-black text-gray-900 leading-none">{user?.assignedCount || 0}</div>
                                    </div>
                                    <div className="col-span-2 bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-lg mt-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Star className="w-3.5 h-3.5 text-ember-500 fill-ember-500" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Public Service Rating</span>
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-black text-white italic tracking-tighter">
                                                        {user?.avgRating > 0 ? user.avgRating.toFixed(1) : '5.0'}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-500">/ 5.0</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= Math.round(user?.avgRating || 5) ? 'text-ember-400 fill-ember-400' : 'text-gray-700'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Verification Actions / Status */}
                    {success ? (
                        <div className="text-center animate-fade-in space-y-4 py-6 px-4 bg-green-50 rounded-2xl border border-green-100">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">System Access Upgraded</h2>
                            <div className="text-green-700 text-sm space-y-1 leading-relaxed">
                                <p>You have been officially recognized.</p>
                                {verificationResult?.assignedRole && (
                                    <p className="font-bold">
                                        Role: {verificationResult.assignedRole}
                                        {verificationResult.assignedArea ? ` · Area: ${verificationResult.assignedArea}` : ''}
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
                            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-[13px] text-gray-600 leading-relaxed italic">
                                <div className="flex gap-3">
                                    <Shield className="w-5 h-5 text-civic-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-gray-800 not-italic">Officer & President Privileges</p>
                                        <p className="mt-1">Verified members gain access to incident resolution tools, analytics dashboard, and direct civic reporting.</p>
                                    </div>
                                </div>
                            </div>

                            {verifyMutation.isError && (
                                <div className="flex items-center gap-2 text-red-600 text-[13px] font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                                    <AlertCircle className="w-4 h-4" />
                                    {verifyMutation.error?.response?.data?.error || "Email verification failed"}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={verifyMutation.isPending}
                                className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all shadow-lg shadow-civic-200"
                            >
                                {verifyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-white/80" />}
                                <span className="font-extrabold uppercase tracking-widest text-sm">
                                    {verifyMutation.isPending ? 'Verifying...' : 'Verify & Upgrade Now'}
                                </span>
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/admin')}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl active:scale-[0.98]"
                            >
                                <BarChart3 className="w-5 h-5 text-ember-400" />
                                Go to Command Center
                            </button>
                            <p className="text-[11px] text-center text-gray-400 font-medium italic">
                                Your account is authorized for administrative actions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
