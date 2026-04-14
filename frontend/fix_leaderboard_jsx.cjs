const fs = require('fs');

const content = `import { Trophy, Star, Shield, Target, User, ChevronDown } from 'lucide-react'
import { useLeaderboard, useRateOfficerGeneral } from '../hooks/useIssues'
import { useUser } from '@clerk/clerk-react'
import { useState } from 'react'

const StarRating = ({ rating, size = 'sm' }) => {
    const full = Math.floor(rating)
    const half = rating - full >= 0.5
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={\`\${sizeClass} \${
                        i <= full
                            ? 'text-[var(--glow)] fill-[var(--glow)] drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]'
                            : i === full + 1 && half
                                ? 'text-[var(--glow)]/60 fill-[var(--glow)]/40'
                                : 'text-white/10'
                    }\`}
                />
            ))}
            <span className={\`ml-2 font-black \${size === 'sm' ? 'text-sm' : 'text-lg'} text-white\`}>
                {rating > 0 ? rating.toFixed(1) : 'NEW'}
            </span>
        </div>
    )
}

export default function Leaderboard() {
    const { data: officers, isLoading } = useLeaderboard()
    const { user } = useUser()
    const isCitizen = !!user
    const rateMutation = useRateOfficerGeneral()
    const [ratingState, setRatingState] = useState({})

    const toggleRating = (id) => {
        setRatingState(prev => ({
            ...prev,
            [id]: prev[id] ? false : true
        }))
    }

    const handleRate = (id, newRating) => {
        rateMutation.mutate({ officerId: id, rating: newRating }, {
            onSuccess: () => {
                setRatingState(prev => ({...prev, [id]: false}))
            }
        })
    }

    if (isLoading) {
        return (
            <div className="page-container py-24 flex flex-col items-center justify-center min-h-[60vh] relative z-10 w-full">
                <div className="w-16 h-16 border-t-2 border-r-2 border-[var(--glow)] rounded-full animate-spin shadow-[0_0_30px_rgba(0,255,255,0.2)]"></div>
                <p className="mt-8 text-[var(--glow)] font-black text-sm uppercase tracking-[0.3em] animate-pulse">Compiling Ranks...</p>
            </div>
        )
    }

    return (
        <div className="page-container py-12 md:py-24 mt-4 md:mt-8 relative z-10 w-full min-h-screen">
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,255,0.03),transparent_70%)] pointer-events-none -z-10" />

            {/* Header Section */}
            <div className="mb-16 text-center max-w-2xl mx-auto scroll-animate slide-down">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] panel glass border-[var(--glow)]/20 shadow-[0_0_40px_rgba(0,255,255,0.1)] mb-6">
                    <Trophy className="w-10 h-10 text-[var(--glow)] drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-md">Authority Ranks</h1>
                <p className="text-[var(--text-muted)] text-lg">Top performing officials driving real civic change. Hold authorities accountable with community-driven governance.</p>
            </div>

            {/* Leaderboard List */}
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                {officers?.map((officer, index) => {
                    const rank = index + 1;
                    const isTopThree = rank <= 3;
                    
                    const rankStyle = rank === 1 
                        ? 'border-[var(--glow)]/50 bg-[var(--glow)]/5 shadow-[0_0_30px_rgba(0,255,255,0.15)] scale-[1.02] md:scale-105 z-10'
                        : rank === 2 
                        ? 'border-white/30 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                        : rank === 3 
                        ? 'border-white/10 bg-white/[0.02] shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                        : 'border-white/5 bg-transparent opacity-80 hover:opacity-100 hover:border-white/20';

                    const rankBadge = rank === 1
                        ? 'text-black bg-[var(--glow)] shadow-[0_0_20px_rgba(0,255,255,0.6)]'
                        : rank === 2
                        ? 'text-black bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                        : rank === 3
                        ? 'text-white bg-white/20 border border-white/30'
                        : 'text-[var(--text-muted)] bg-transparent font-bold border border-white/5';

                    return (
                        <div key={officer.id} className={\`scroll-animate slide-up panel glass rounded-[1.5rem] p-6 transition-all duration-300 backdrop-blur-xl \${rankStyle}\`}>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative">
                                
                                {/* Rank Badge Absolute on Mobile / Sticky Desktop */}
                                <div className={\`absolute md:static top-0 right-0 md:translate-y-0 -translate-y-2 translate-x-2 md:translate-x-0 w-12 h-12 flex items-center justify-center rounded-2xl text-xl font-black \${rankBadge}\`}>
                                    #{rank}
                                </div>

                                {/* Avatar */}
                                <div className="shrink-0 w-24 h-24 rounded-[2rem] border border-white/10 overflow-hidden relative shadow-inner bg-black/40 flex items-center justify-center">
                                    {officer.imageUrl ? (
                                        <img src={officer.imageUrl} alt={officer.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 text-[var(--text-dim)]" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-3 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                        <h2 className="text-3xl font-black text-white tracking-wide">{officer.name}</h2>
                                        <span className="px-3 py-1 flex items-center gap-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[var(--glow)]/30 bg-[var(--glow)]/10 text-[var(--glow)]">
                                            <Shield className="w-3 h-3" />
                                            {officer.role}
                                        </span>
                                    </div>
                                    
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 w-full mt-2">
                                        <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center md:items-start">
                                            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1"><Target className="w-3 h-3"/> Resolutions</span>
                                            <span className="text-2xl font-black text-white">{officer.issuesResolved}</span>
                                        </div>
                                        <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center md:items-start relative group">
                                            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mb-1.5 ">Rating Score</span>
                                            <StarRating rating={officer.avgRating || 0} size="sm" />
                                        </div>
                                    </div>
                                    
                                    {/* Rating Expansion logic */}
                                    {isCitizen && (
                                        <div className="w-full mt-2 border-t border-[var(--border-clean)] pt-4">
                                            <button 
                                                onClick={() => toggleRating(officer.id)}
                                                className="w-full py-2 flex justify-center items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-white uppercase tracking-widest transition-colors"
                                            >
                                                Rate Official <ChevronDown className={\`w-4 h-4 transition-transform \${ratingState[officer.id] ? 'rotate-180' : ''}\`}/>
                                            </button>

                                            <div className={\`overflow-hidden transition-all duration-500 \${ratingState[officer.id] ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0'}\`}>
                                                <div className="bg-black/50 border border-[var(--glow)]/20 p-4 rounded-xl flex items-center justify-between gap-4">
                                                    <span className="text-sm font-bold text-[var(--text-muted)]">Select Rating:</span>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                onClick={() => handleRate(officer.id, star)}
                                                                disabled={rateMutation.isLoading}
                                                                className="w-10 h-10 rounded-full border border-white/10 hover:border-[var(--glow)] hover:bg-[var(--glow)]/10 text-white transition-all flex items-center justify-center font-black group"
                                                            >
                                                                <Star className="w-4 h-4 group-hover:text-[var(--glow)] group-hover:fill-[var(--glow)] transition-colors" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
                {(!officers || officers.length === 0) && (
                    <div className="text-center py-20 panel glass rounded-3xl opacity-50">
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-[var(--text-dim)]" />
                        <h3 className="text-xl font-bold text-[var(--text-muted)]">No authority rankings established yet.</h3>
                    </div>
                )}
            </div>
        </div>
    )
}
`

fs.writeFileSync('src/pages/Leaderboard.jsx', content);
