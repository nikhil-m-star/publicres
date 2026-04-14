import { useState } from 'react';
import { Sparkles, MapPin, ArrowLeft, Bot, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { BENGALURU_AREAS } from '../data/bengaluruAreas';
import { PlayfulLoader } from '../components/ui/Loading';

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
        <div className="page-container py-12 md:py-24 mt-16 md:mt-24 relative z-10">
            {/* Clean Header */}
            <div className="mb-10 max-w-4xl mx-auto">
                <Link to="/#reports" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors mb-6 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Hub
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl panel glass flex items-center justify-center border border-[var(--border-glow)] shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                        <Bot className="w-6 h-6 text-[var(--glow)]" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">AI Health Report</h1>
                        <p className="text-[var(--text-dim)] mt-2 font-medium">
                            Harness real-time civic data to generate a deep-dive health synthesis.
                        </p>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            {!report && !loading && (
                <div className="panel glass p-8 md:p-12 rounded-[2rem] border-[var(--border-clean)] group hover:border-[var(--glow)]/30 transition-colors max-w-4xl mx-auto">
                    <div className="max-w-2xl mx-auto flex flex-col gap-8">
                        <label className="text-2xl font-bold text-white text-center flex flex-col items-center gap-4">
                            <MapPin className="w-10 h-10 text-[var(--text-muted)] group-hover:text-[var(--glow)] transition-colors" />
                            Select a locality to analyze
                        </label>
                        
                        <div className="flex flex-col md:flex-row gap-4">
                            <select
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="flex-1 px-5 py-4 panel glass !bg-black/50 border border-[var(--border-clean)] focus:border-[var(--glow)] rounded-xl appearance-none text-white outline-none cursor-pointer text-lg font-medium tracking-wide"
                            >
                                <option value="" disabled className="bg-black text-gray-500">Choose area...</option>
                                {BENGALURU_AREAS.map((areaName) => (
                                    <option key={areaName} value={areaName} className="bg-black text-white py-2">{areaName}</option>
                                ))}
                            </select>
                            <button
                                onClick={generateReport}
                                disabled={!area.trim()}
                                className="btn-primary px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg active:scale-95 transition-transform"
                            >
                                <Zap className="w-5 h-5" />
                                Synthesize
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-center text-sm bg-red-500/10 py-3 rounded-lg border border-red-500/20 font-medium">{error}</p>}
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="panel glass p-12 rounded-[2rem] border-[var(--border-clean)] flex flex-col items-center justify-center max-w-4xl mx-auto animate-pulse">
                    <PlayfulLoader text="Synthesizing local civic data..." />
                </div>
            )}

            {/* Generated Report */}
            {report && (
                <div className="panel glass border-[var(--border-clean)] rounded-[2rem] overflow-hidden max-w-4xl mx-auto">
                    <div className="p-8 border-b border-[var(--border-clean)] bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-1">{area} Analysis</h2>
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--glow)] flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" /> Neural Synthesis Complete
                            </p>
                        </div>
                        <button
                            onClick={() => setReport(null)}
                            className="px-6 py-3 panel glass hover:border-[var(--glow)]/50 rounded-xl text-white font-medium text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> New Scan
                        </button>
                    </div>

                    <div className="p-8 md:p-12">
                        {report.includes('No recent issues found') ? (
                            <div className="text-center py-16 px-6">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                    <Sparkles className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Spotless Locality!</h3>
                                <p className="text-[var(--text-dim)] text-lg max-w-lg mx-auto">
                                    Our scan detected absolute zero active civic disruptions in <span className="font-bold text-white">{area}</span>. The infrastructure looks very well-maintained.
                                </p>
                            </div>
                        ) : (
                            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ node, ...props }) => <h1 className="text-3xl font-black text-white mb-6 pb-4 border-b border-[var(--border-clean)]" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-[var(--glow)] mt-10 mb-4 flex items-center gap-3 before:content-[''] before:block before:w-1.5 before:h-6 before:bg-[var(--glow)] before:rounded-full" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-8 mb-3" {...props} />,
                                        p: ({ node, ...props }) => <p className="leading-relaxed mb-6 text-[var(--text-dim)]" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="space-y-3 mb-8" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-3 mb-8 text-[var(--text-dim)]" {...props} />,
                                        li: ({ node, ...props }) => (
                                            <li className="flex items-start gap-3" {...props}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--glow)] mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(0,255,255,0.5)]"></span>
                                                <div className="flex-1 text-[var(--text-dim)] font-medium leading-relaxed">{props.children}</div>
                                            </li>
                                        ),
                                        strong: ({ node, ...props }) => <strong className="font-bold text-white bg-white/5 border border-white/10 px-1.5 py-0.5 rounded shadow-sm" {...props} />,
                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[var(--glow)] bg-white/5 py-4 pr-6 pl-6 italic text-gray-400 rounded-r-xl my-6" {...props} />
                                    }}
                                >
                                    {report}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
