import { ArrowLeft, MapPin, LayoutList } from 'lucide-react'
import { Link } from 'react-router-dom'
import ReportsBoard from '../components/ReportsBoard'

export default function CommunityReports() {
    return (
        <div className="page-container py-12 md:py-24 mt-16 md:mt-24 relative z-10 w-full min-h-screen">
            {/* Background elements */}
            <div className="fixed top-32 left-10 w-[500px] h-[500px] bg-[var(--glow)]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors mb-10 text-sm font-bold">
                <ArrowLeft className="w-4 h-4" />
                Return to Hub
            </Link>
            
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl panel glass flex items-center justify-center border border-[var(--border-glow)] shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                        <LayoutList className="w-8 h-8 text-[var(--glow)]" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Civic Ledger</h1>
                        <p className="text-[var(--text-dim)] font-medium text-lg mt-2 max-w-xl">
                            Browse, track, and verify the status of public infrastructure reports verified by block residents.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="panel glass p-6 md:p-12 rounded-[2rem] border-[var(--border-clean)] relative shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--glow)] to-transparent opacity-50 shadow-[0_0_15px_rgba(0,255,255,1)]"></div>
                 <ReportsBoard scope="all" showFormToggle={false} title="Public Archives" subtitle="Browse global public submissions" />
            </div>
        </div>
    )
}
