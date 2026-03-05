import { useState } from 'react';
import { api } from '../api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Key, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminVerification() {
    const [otp, setOtp] = useState('');
    const [role, setRole] = useState('OFFICER');
    const [area, setArea] = useState('Bengaluru Central');
    const [success, setSuccess] = useState(false);
    const queryClient = useQueryClient();

    const verifyMutation = useMutation({
        mutationFn: api.verifyAdminOtp,
        onSuccess: () => {
            setSuccess(true);
            queryClient.invalidateQueries({ queryKey: ['me'] }); // if applicable, to hard-refresh user state
            // Optionally reload page to force Clerk + JWT role propagation
            setTimeout(() => window.location.assign('/admin'), 2000);
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-civic-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Verification</h1>
                    <p className="text-civic-100">Enter your secure OTP to upgrade your account access.</p>
                </div>

                <div className="p-8 space-y-6">
                    {success ? (
                        <div className="text-center animate-fade-in space-y-4 py-4">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                            <h2 className="text-xl font-semibold text-gray-900">Verification Successful</h2>
                            <p className="text-gray-500">Your account has been upgraded. Redirecting to Admin Panel...</p>
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                verifyMutation.mutate({ otp, requestedRole: role, area: role === 'OFFICER' ? area : undefined });
                            }}
                            className="space-y-5"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secret OTP</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-civic-500 focus:ring-4 focus:ring-civic-500/10 outline-none transition-all"
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Requested Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-civic-500 focus:ring-4 focus:ring-civic-500/10 outline-none transition-all"
                                >
                                    <option value="OFFICER">Officer</option>
                                    <option value="PRESIDENT">President</option>
                                </select>
                            </div>

                            {role === 'OFFICER' && (
                                <div className="animate-fade-in">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Area</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={area}
                                            onChange={(e) => setArea(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-civic-500 focus:ring-4 focus:ring-civic-500/10 outline-none transition-all"
                                            placeholder="e.g., Koramangala"
                                        />
                                    </div>
                                </div>
                            )}

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
