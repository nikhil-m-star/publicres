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
                    className={`${sizeClass} ${
                        i <= full
                            ? 'text-[var(--glow)] fill-[var(--glow)] shadow-[0_0_10px_rgba(0,255,255,0.4)]'
                            : i === full + 1 && half
                                ? 'text-[var(--glow)]/50 fill-[var(--glow)]/30'
                                : 'text-gray-700'
                    }`}
                />
            ))}
            <span className={`ml-2 font-black ${size === 'sm' ? 'text-xs' : 'text-sm'} text-[var(--glow)]`}>
                {rating > 0 ? rating.toFixed(1) : 'NEW'}
            </span>
        </div>
    )
}

const roleColors = {
    PRESIDENT: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    OFFICER: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

const roleTitles = {
    PRESIDENT: 'President',
    OFFICER: 'Officer',
}

export default function Leaderboard() {
    const { data: officers, isLoading } = useLeaderboard()
    const { user } = useUser()
    const isCitizen = !!user

    const rateMutation = useRateOfficerGeneral()

    const handleRate = (id, newRating) => {
        rateMutation.mutate({ officerId: id, rating: newRating })
    }

    if (isLoading) {
        return (
            <div className="page-container py-12 md:py-24 mt-16 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-t-2 border-r-2 border-[var(--glow)] rounded-full animate-spin"></div>
                <p className="mt-4 text-[var(--text-muted)] font-black text-sm uppercase tracking-widest animate-pulse">Calculating Ranks...</p>
            </div>
        )
    }

    return (
        <div className="page-container py-12 md:py-24 mt-16 md:mt-24 relative z-10 w-full min-h-screen">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-amber-500/5 via-[var(--glow)]/5 to-transparent -z-10 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl panel glass flex items-center justify-center border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                        <Trophy className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Authority Rankings</h1>
                        <p className="text-[var(--text-dim)] font-medium text-lg mt-2 max-w-xl">
                            Public operational efficiency index of civic leaders based on resolution speed and community trust.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
                {officers?.map((officer, index) => {
                    const rank = index + 1
                    
                    let medalBadge = null
                    if (rank === 1) medalBadge = <div className="absolute -top-3 -left-3 w-10 h-10 bg-amber-500/20 border border-amber-400/50 rounded-full flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] backdrop-blur-md font-black">1</div>
                    else if (rank === 2) medalBadge = <div className="absolute -top-3 -left-3 w-10 h-10 bg-gray-300/20 border border-gray-300/50 rounded-full flex items-center justify-center text-gray-300 shadow-[0_0_20px_rgba(209,213,219,0.2)] backdrop-blur-md font-black">2</div>
                    else if (rank === 3) medalBadge = <div className="absolute -top-3 -left-3 w-10 h-10 bg-orange-700/20 border border-orange-600/50 rounded-full flex items-center justify-center text-orange-500 shadow-[0_0_20px_rgba(194,65,12,0.3)] backdrop-blur-md font-black">3</div>
                    else medalBadge = <div className="absolute top-6 right-6 font-black text-4xl text-white/5 pointer-events-none">#{rank}</div>

                    return (
                        <div key={officer.id} className="panel glass p-6 md:p-8 rounded-[2rem] border-[var(--border-clean)] relative overflow-hidden group hover:border-[var(--glow)]/30 hover:bg-white/[0.02] transition-all shadow-lg hover:shadow-[0_10px_40px_-20px_rgba(0,255,255,0.3)]">
                            {medalBadge}
                            
                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                <div className="shrink-0 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[var(--border-clean)] group-hover:border-[var(--glow)]/50 transition-colors shadow-inner relative">
                                        {officer.imageUrl ? (
                                            <img src={officer.imageUrl} alt={officer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-black/50 flex flex-col items-center justify-center text-[var(--text-muted)]">
                                                <Users className="w-10 h-10 mb-1 opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                                        <h2 className="text-2xl font-black text-white group-hover:text-[var(--glow)] transition-colors">{officer.name}</h2>
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${roleColors[officer.role] || 'bg-white/5 text-gray-400 border-white/10'}`}>
                                                {roleTitles[officer.role] || officer.role}
                                            </span>
                                            {officer.jurisdiction && (
                                                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border bg-[var(--glow)]/5 text-[var(--glow)] border-[var(--glow)]/20 shadow-[inset_0_0_10px_rgba(0,255,255,0.05)]">
                                                    {officer.jurisdiction}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-1 flex items-center gap-1">
                                                <Star className="w-3 h-3 text-amber-500/50" /> Trust Score
                                            </span>
                                            <StarRating rating={officer.rating} size="lg" />
                                        </div>
                                        
                                        <div className="w-px h-8 bg-white/5 hidden sm:block"></div>
                                        
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-1 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3 text-emerald-500/50" /> Total Solved
                                            </span>
                                            <span className="text-xl font-black text-white">
                                                {officer._count?.resolvedBy} <span className="text-sm font-medium text-gray-500 ml-1">jobs</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {isCitizen && (
                                    <div className="shrink-0 flex items-center justify-center border-l border-[var(--border-clean)] pl-6 ml-6">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-center mb-1">Evaluate</p>
                                            <div className="flex gap-1.5 p-2 panel glass rounded-xl bg-black/40">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleRate(officer.id, i)}
                                                        disabled={rateMutation.isPending}
                                                        className="p-1 hover:scale-125 transition-transform disabled:opacity-50"
                                                    >
                                                        <Star className="w-5 h-5 text-gray-600 hover:text-[var(--glow)] hover:fill-[var(--glow)] transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}

                {officers?.length === 0 && (
                    <div className="text-center py-20 panel glass rounded-[2rem] border-[var(--border-clean)]">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-10 h-10 text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">No Ratings Yet</h3>
                        <p className="text-[var(--text-dim)]">Officers are currently accumulating trust metrics.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
