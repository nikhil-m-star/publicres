import { useState } from 'react'
import { Bell } from 'lucide-react'
import ReportsBoard from '../components/ReportsBoard'
import NotificationsPanel from '../components/NotificationsPanel'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('reports')

    return (
        <div className="page-container">
            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'reports'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    My Reports
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === 'notifications'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Bell className="w-3.5 h-3.5" />
                    Notifications
                </button>
            </div>

            {activeTab === 'notifications' ? (
                <NotificationsPanel />
            ) : (
                <ReportsBoard
                    scope="mine"
                    title="My Reports"
                    subtitle="Track the civic issues you have reported and their status."
                    emptySubtitle="Submit your first report and it will show up here."
                />
            )}
        </div>
    )
}
