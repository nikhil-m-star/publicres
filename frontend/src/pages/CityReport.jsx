import { useState } from 'react';
import { Sparkles, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function CityReport() {
    const [area, setArea] = useState("");
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateReport = async () => {
        if (!area.trim()) return;
        setLoading(true);
        setError("");
        setReport(null);
        try {
            const data = await api.getCityReport(area);
            setReport(data.reportMarkdown);
        } catch (err) {
            console.error(err);
            setError("Failed to generate report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3 text-civic-700">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Locality Health Report</h1>
                            <p className="text-gray-600 mt-1">
                                Generate an AI-powered insights report for any area within Bengaluru.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Input Section */}
                {!report && !loading && (
                    <div className="bg-white border text-left border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm animate-fade-in">
                        <div className="max-w-xl">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Which area inside Bengaluru would you like to analyze?
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        placeholder="e.g., Koramangala, Indiranagar, Jayanagar"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-civic-500 focus:ring-4 focus:ring-civic-500/10 outline-none transition-all"
                                        onKeyDown={(e) => e.key === 'Enter' && generateReport()}
                                    />
                                </div>
                                <button
                                    onClick={generateReport}
                                    disabled={!area.trim()}
                                    className="btn bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl transition-colors sm:w-auto w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Generate
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Synthesizing Data</h3>
                        <p className="text-gray-500 mt-2 max-w-sm animate-pulse">
                            Our AI is analyzing recent civic reports, severity levels, and resolution times for {area}, Bengaluru...
                        </p>
                    </div>
                )}

                {/* Generated Report */}
                {report && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{area} Insights</h2>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                                    AI Generated Synthesis
                                </p>
                            </div>
                            <button
                                onClick={() => setReport(null)}
                                className="text-sm font-medium text-civic-600 hover:text-civic-700 hover:bg-civic-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-civic-100"
                            >
                                Analyze Another Area
                            </button>
                        </div>

                        {/* Custom markdown rendering to fix hyperlink visibility and base styling */}
                        <div className="w-full overflow-hidden">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900 pb-2 border-b border-gray-100" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-800" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-5 mb-2 text-gray-800" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-4 text-gray-600 leading-relaxed" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-1.5 marker:text-gray-400" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 text-gray-600 space-y-1.5 marker:text-gray-400" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                    a: ({ node, ...props }) => (
                                        <a
                                            className="text-civic-600 font-medium hover:text-civic-800 underline decoration-civic-300 hover:decoration-civic-600 underline-offset-2 transition-all"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        />
                                    ),
                                    strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-200 pl-4 py-1 italic text-gray-500 mb-4 bg-gray-50 rounded-r-lg" {...props} />
                                }}
                            >
                                {report}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
