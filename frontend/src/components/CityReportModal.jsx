import { useState } from 'react';
import { Sparkles, X, MapPin, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '../api/client';

export default function CityReportModal({ isOpen, onClose }) {
    const [city, setCity] = useState("Bengaluru");
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const generateReport = async () => {
        if (!city.trim()) return;
        setLoading(true);
        setError("");
        setReport(null);
        try {
            const data = await api.getCityReport(city);
            setReport(data.reportMarkdown);
        } catch (err) {
            console.error(err);
            setError("Failed to generate report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2 text-civic-700">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <h2 className="text-lg font-semibold">AI City Insights</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {!report && !loading && (
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                Get a quick, AI-generated summary of recent civic issues and the overall health of any city powered by Groq.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Enter city name (e.g., Bengaluru)"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-civic-500 focus:ring-4 focus:ring-civic-500/10 outline-none transition-all"
                                    />
                                </div>
                                <button
                                    onClick={generateReport}
                                    className="btn-primary sm:w-auto w-full flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Generate
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-4">
                            <Loader2 className="w-8 h-8 animate-spin text-civic-500" />
                            <p className="animate-pulse">Analyzing civic data for {city} via Groq Llama 3...</p>
                        </div>
                    )}

                    {report && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{city} Report</h3>
                                    <p className="text-sm text-gray-500">Live AI Synthesis</p>
                                </div>
                                <button
                                    onClick={() => setReport(null)}
                                    className="text-sm font-medium text-civic-600 hover:text-civic-700"
                                >
                                    Change City
                                </button>
                            </div>
                            <div className="prose prose-sm sm:prose-base max-w-none prose-a:text-civic-600 prose-a:font-medium hover:prose-a:underline prose-headings:text-gray-800">
                                <ReactMarkdown>{report}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
