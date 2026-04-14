import { Sparkles } from 'lucide-react'

export function PlayfulLoader({ text = "Loading...", fullScreen = false }) {
    const loader = (
        <div className="flex flex-col items-center justify-center gap-6 p-8 animate-slide-pop">
            <div className="relative">
                <div className="absolute inset-0 rounded-full animate-pulse-ring bg-[var(--accent-soft)]"></div>
                <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--accent)] flex items-center justify-center z-10 relative shadow-[0_0_20px_var(--accent-soft)]">
                    <Sparkles className="w-8 h-8 text-[var(--accent)] animate-spin-slow" />
                </div>
            </div>
            
            <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-[var(--accent)] tracking-wide">{text}</h3>
                <div className="playful-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-md">
                {loader}
            </div>
        )
    }

    return (
        <div className="panel flex items-center justify-center min-h-[300px] w-full bg-[var(--bg-card)]/50 border-[var(--border-glass)]">
            {loader}
        </div>
    )
}
