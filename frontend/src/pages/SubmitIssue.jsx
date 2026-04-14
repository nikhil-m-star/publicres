import { ArrowLeft, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import IssueForm from '../components/IssueForm'

export default function SubmitIssue() {
    const navigate = useNavigate()

    return (
        <div className="page-container py-12">
            <Link to="/map" className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-white transition-colors mb-8 px-4 py-2 rounded-xl bg-[var(--accent-soft)] w-fit border border-[var(--accent-pill)]">
                <ArrowLeft className="w-4 h-4" />
                Back to Map
            </Link>
            
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent-pill)] flex items-center justify-center text-[var(--accent)] mb-4">
                        <Sparkles className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--text-main)] mb-3">Report a Civic Issue</h1>
                    <p className="text-[var(--text-muted)]">Help us improve the city by reporting potholes, garbage, streetlight failures, and more.</p>
                </div>
                
                <div className="card panel p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>
                    <IssueForm onSuccess={() => navigate('/map')} />
                </div>
            </div>
        </div>
    )
}
