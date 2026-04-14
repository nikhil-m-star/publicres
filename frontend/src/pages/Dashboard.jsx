import { useState } from 'react'
import { Bell, LayoutDashboard } from 'lucide-react'
import ReportsBoard from '../components/ReportsBoard'
import NotificationsPanel from '../components/NotificationsPanel'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('reports')

    return (
        <div className="page-container py-12 md:py-24 mt-12 md:mt-16 w-full min-h-screen relative z-10">
            {/* Background elements */}
            <div className="fixed top-20 right-10 w-[500px] h-[500px] bg-[var(--glow)]/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl panel glass flex items-center justify-center border border-[var(--border-glow)] shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                    <LayoutDashboard className="w-7 h-7 text-[var(--glow)]" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Citizen Portal</h1>
                    <p className="text-[var(--text-dim)] font-medium mt-1">Track your civic impact and personal reports.</p>
                </div>
            </div>

            <div className="flex gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all whitespace-nowrap ${
                        activeTab === 'reports'
                            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                            : 'panel glass text-[var(--text-muted)] hover:text-white border-[var(--border-clean)] hover:border-white/20'
                    }`}
                >
                    My Reports
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
                        activeTab === 'notifications'
                            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                            : 'panel glass text-[var(--text-muted)] hover:text-white border-[var(--border-clean)] hover:border-white/20'
                    }`}
                >
                    <Bell className="w-4 h-4" />
                    Updates
                </button>
            </div>

            <div className="relative z-10 transition-all duration-500">
                {activeTab === 'notifications' ? (
                    <div className="panel glass p-6 md:p-10 rounded-[2rem] border border-[var(--border-clean)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                        <h2 className="text-2xl font-black text-white mb-8 border-b border-white/5 pb-4">Personal Alerts</h2>
                        <NotificationsPanel />
                    </div>
                ) : (
                    <ReportsBoard
                        scope="mine"
                        title="Your Active Tickets"
                        subtitle="Detailed logs of the local issues you've reported."
                        emptySubtitle="Be the spark. Submit your first report and track its lifecycle."
                    />
                )}
            </div>
        </div>
    )
}
