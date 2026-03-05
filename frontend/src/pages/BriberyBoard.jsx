import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Flame, MapPin, AlertCircle, Map, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import IssueForm from '../components/IssueForm';

export default function BriberyBoard() {
    const [city, setCity] = useState("Bengaluru");
    const [view, setView] = useState("list"); // list or map
    const [showForm, setShowForm] = useState(false);

    // Reuse the issues hook but filter locally (or we can add category filter to backend if we want, 
    // but we added city & category filters to backend in Phase 2)
    const { data: issues, isLoading } = useQuery({
        queryKey: ['issues', city, 'BRIBERY'],
        queryFn: () => api.getIssues({ city, category: 'BRIBERY' }),
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header */}
            <div className="bg-red-50 border border-red-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                        <Flame className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Anti-Bribery Board</h1>
                        <p className="text-gray-600 mt-1">
                            A secure, direct channel for reporting corruption. Reports are escalated immediately to Regional Officers and the President.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            className="w-full pl-9 pr-4 py-2 bg-white border border-red-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none"
                        />
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-xl transition-colors shrink-0"
                    >
                        Report Incident
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="bg-white border text-left border-gray-100 rounded-2xl p-6 shadow-sm mb-6 animate-fade-in">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">File a new Report</h2>
                    <IssueForm onSuccess={() => setShowForm(false)} />
                </div>
            )}

            {/* List vs Map Toggle */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setView('list')}
                    className={`pb-3 px-4 font-medium text-sm transition-colors relative ${view === 'list' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    List View
                    {view === 'list' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></span>}
                </button>
                <button
                    onClick={() => setView('map')}
                    className={`pb-3 px-4 font-medium text-sm transition-colors relative ${view === 'map' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Map View
                    {view === 'map' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></span>}
                </button>
            </div>

            {/* Content Display */}
            <div className="min-h-[400px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    </div>
                ) : !issues || issues.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p>No bribery reports found for {city}.</p>
                    </div>
                ) : view === 'map' ? (
                    <div className="h-[600px] bg-white rounded-2xl border border-gray-100 overflow-hidden relative shadow-sm">
                        <MapContainer
                            center={[issues[0]?.latitude || 12.9716, issues[0]?.longitude || 77.5946]}
                            zoom={12}
                            className="h-full w-full"
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {issues.map((issue) => (
                                <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
                                    <Popup className="custom-popup">
                                        <div className="p-1 max-w-xs">
                                            <div className="text-xs font-bold text-red-600 mb-1">Severity: {issue.intensity || "High"}</div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{issue.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{issue.description}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {issues.map(issue => (
                            <div key={issue.id} className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="px-2.5 py-1 bg-red-50 text-red-700 font-semibold text-xs rounded-lg uppercase tracking-wider">
                                        Intensity: {issue.intensity || "?"}/10
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(issue.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">{issue.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{issue.description}</p>

                                <div className="flex items-center text-xs text-gray-500">
                                    <MapPin className="w-3.5 h-3.5 mr-1" />
                                    {city}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
