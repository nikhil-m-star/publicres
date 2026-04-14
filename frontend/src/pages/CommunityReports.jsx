import { ArrowLeft, Sparkles, LayoutList } from 'lucide-react'
import { Link } from 'react-router-dom'
import ReportsBoard from '../components/ReportsBoard'

export default function CommunityReports() {
    return (
        <div className="page-container py-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-white transition-colors mb-8 px-4 py-2 rounded-xl bg-[var(--accent-soft)] w-fit border border-[var(--accent-pill)]">
                <ArrowLeft className="w-4 h-4" />
                Back Home
            </Link>
            
            <div className="mb-8 flex flex-col items-start">
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent-pill)] flex items-center justify-center text-[var(--accent)] mb-4">
                    <LayoutList className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-bold text-[var(--text-main)] mb-3">Community Reports</h1>
                <p className="text-[var(--text-muted)]">Browse recent issues, filter by category, and see the resolution status of civic jobs submitted by residents.</p>
            </div>
            
            <div className="card panel p-8 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>
                 <ReportsBoard scope="all" showFormToggle={false} />
            </div>
        </div>
    )
}
