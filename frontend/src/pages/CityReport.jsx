import { useState } from 'react';
import { Sparkles, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { BENGALURU_AREAS } from '../data/bengaluruAreas';

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
            const data = await api.getCityReport({ area, city: 'Bengaluru' });
            setReport(data.reportMarkdown);
        } catch (err) {
            console.error(err);
            setError("Failed to generate report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="report-shell">
            <div className="page-container">
                {/* Header */}
                <div className="report-header">
                    <Link to="/#reports" className="report-back">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Reports
                    </Link>
                    <div className="report-hero">
                        <div className="report-icon">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="report-title">Locality Health Report</h1>
                            <p className="report-subtitle">
                                Generate an AI-powered insights report for any area within Bengaluru.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Input Section */}
                {!report && !loading && (
                    <div className="panel report-panel">
                        <div className="report-form">
                            <label className="report-label">
                                Which area inside Bengaluru would you like to analyze?
                            </label>
                            <div className="report-controls">
                                <div className="report-select">
                                    <MapPin className="w-5 h-5" />
                                    <select
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                    >
                                        <option value="" disabled>Select an area</option>
                                        {BENGALURU_AREAS.map((areaName) => (
                                            <option key={areaName} value={areaName}>{areaName}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={generateReport}
                                    disabled={!area.trim()}
                                    className="btn-primary report-generate"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Generate
                                </button>
                            </div>
                            {error && <p className="report-error">{error}</p>}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="panel report-loading">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <h3>Synthesizing Data</h3>
                        <p>
                            Our AI is analyzing recent civic reports, severity levels, and resolution times for {area}, Bengaluru...
                        </p>
                    </div>
                )}

                {/* Generated Report */}
                {report && (
                    <div className="panel report-output">
                        <div className="report-output__head">
                            <div>
                                <h2>{area} Insights</h2>
                                <p>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    AI Generated Synthesis
                                </p>
                            </div>
                            <button
                                onClick={() => setReport(null)}
                                className="btn-secondary report-reset"
                            >
                                Analyze Another Area
                            </button>
                        </div>

                        {report.includes('No recent issues found') ? (
                            <div className="text-center py-16 px-6 bg-gray-50 rounded-2xl border border-gray-100 mt-6">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200">
                                    <MapPin className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Looking Good!</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    There are no recent civic issues reported in <span className="font-semibold text-gray-700">{area}</span>. This locality appears to be well-maintained at the moment.
                                </p>
                            </div>
                        ) : (
                            <div className="report-md mt-6">
                                <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="report-md__h1" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="report-md__h2" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="report-md__h3" {...props} />,
                                    p: ({ node, ...props }) => <p className="report-md__p" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="report-md__list" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="report-md__list" {...props} />,
                                    li: ({ node, ...props }) => <li className="report-md__item" {...props} />,
                                    a: ({ node, ...props }) => (
                                        <a
                                            className="report-md__link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        />
                                    ),
                                    strong: ({ node, ...props }) => <strong className="report-md__strong" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="report-md__quote" {...props} />
                                }}
                            >
                                {report}
                            </ReactMarkdown>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
