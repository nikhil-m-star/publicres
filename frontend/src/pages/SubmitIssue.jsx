import { ArrowLeft, Sparkles, MapPin } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import IssueForm from '../components/IssueForm'

export default function SubmitIssue() {
    const navigate = useNavigate()

    return (
        <div className="page-container py-12 md:py-24 mt-16 md:mt-24 relative z-10 w-full min-h-screen">
            {/* Background elements */}
            <div className="fixed top-20 left-10 w-[500px] h-[500px] bg-[var(--glow)]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-3xl mx-auto">
                <Link to="/map" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors mb-8 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Map
                </Link>
                
                <div className="mb-10 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl panel glass flex items-center justify-center border border-[var(--border-glow)] shadow-[0_0_20px_rgba(0,255,255,0.1)] mb-6">
                        <MapPin className="w-8 h-8 text-[var(--glow)] animate-pulse-slow" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Report a Civic Issue</h1>
                </div>
                
                <div className="panel glass p-8 md:p-12 rounded-[2rem] border-[var(--border-clean)] relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--glow)] to-transparent opacity-50 shadow-[0_0_15px_rgba(0,255,255,1)]"></div>
                    <IssueForm onSuccess={() => navigate('/map')} />
                </div>
            </div>
        </div>
    )
}
