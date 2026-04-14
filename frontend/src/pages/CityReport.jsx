import { useState } from 'react';
import { Sparkles, MapPin, Loader2, ArrowLeft, Bot, Activity, Zap } from 'lucide-react';
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
        <div className="min-h-screen relative overflow-hidden bg-black pt-8 pb-24">
            {/* Premium Background Effects */}
            <div className="fixed top-[-10%] right-[10%] w-[500px] h-[500px] bg-[var(--glow)]/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob z-0 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-2000 z-0 pointer-events-none"></div>

            <div className="page-container relative z-10 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link to="/#reports" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors mb-8 group bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Hub
                    </Link>
                    <div className="flex items-start md:items-center flex-col md:flex-row gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--glow)]/20 to-[var(--glow)]/5 border border-[var(--glow)]/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.15)] flex-shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[var(--glow)]/10 animate-pulse"></div>
                            <Bot className="w-8 h-8 text-[var(--glow)] relative z-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(0,255,255,0.2)]">AI Health Report</h1>
                                <span className="px-3 py-1 bg-[var(--glow)]/10 border border-[var(--glow)]/30 rounded-full text-[10px] font-bold text-[var(--glow)] uppercase tracking-widest flex items-center gap-1.5 shadow-[inset_0_0_10px_rgba(0,255,255,0.1)]">
                                    <Activity className="w-3 h-3" /> Live
                                </span>
                            </div>
                            <p className="text-[var(--text-dim)] text-lg border-l-2 border-[var(--glow)]/50 pl-4 mt-3">
                                Harness real-time civic data to generate a deep-dive health synthesis for any locality in Bengaluru.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Input Section */}
                {!report && !loading && (
                    <div className="bg-black/40 backdrop-blur-2xl border border-[var(--border-clean)] rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-[var(--glow)]/30 transition-colors">
                        <div className="absolute top-0 right-0 p-32 bg-[var(--glow)]/5 rounded-full filter blur-[80px] -z-10 group-hover:bg-[var(--glow)]/10 transition-colors"></div>
                        <div className="relative z-10">
                            <label className="block text-2xl font-bold text-white mb-8 text-center flex flex-col items-center gap-4">
                                <MapPin className="w-10 h-10 text-[var(--text-muted)] group-hover:text-[var(--glow)] transition-colors" />
                                Select a locality to analyze
                            </label>
                            
                            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                                <div className="relative flex-1">
                                    <select
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="w-full pl-5 pr-12 py-5 bg-white/5 border border-white/10 hover:border-white/20 focus:border-[var(--glow)] focus:ring-1 focus:ring-[var(--glow)] rounded-2xl appearance-none text-white text-lg outline-none transition-all cursor-pointer font-medium shadow-inner"
                                    >
                                        <option value="" disabled className="text-gray-500 bg-black">Choose area...</option>
                                        {BENGALURU_AREAS.map((areaName) => (
                                            <option key={areaName} value={areaName} className="bg-black text-white py-2">{areaName}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="w-2.5 h-2.5 border-b-2 border-r-2 border-[var(--text-muted)] transform rotate-45 group-hover:border-[var(--glow)] transition-colors"></div>
                                    </div>
                                </div>
                                <button
                                    onClick={generateReport}
                                    disabled={!area.trim()}
                                    className="bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 disabled:hover:scale-100"
                                >
                                    <Zap className="w-5 h-5" />
                                    Synthesize
                                </button>
                            </div>
                            {error && <p className="text-red-400 text-center mt-6 p-3 bg-red-400/10 rounded-xl border border-red-400/20 flex items-center justify-center gap-2"><Activity className="w-4 h-4"/> {error}</p>}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="py-24 flex flex-col items-center justify-center bg-black/20 rounded-[2rem] border border-[var(--border-clean)] backdrop-blur-xl animate-pulse">
                        <PlayfulLoader text="Calibrating neural models and querying local civic data..." />
                        <div className="mt-8 flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-[var(--glow)] animate-bounce" style={{ animationDelay: '0s' }}></span>
                            <span className="w-3 h-3 rounded-full bg-[var(--glow)] animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-3 h-3 rounded-full bg-[var(--glow)] animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}

                {/* Generated Report */}
                {report && (
                    <div className="bg-black/60 backdrop-blur-2xl border border-[var(--border-clean)] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-slide-pop">
                        <div className="p-8 md:p-10 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-[var(--glow)] to-purple-500"></div>
                            <div>
                                <h2 className="text-3xl font-black text-white mb-2">{area} <span className="text-[var(--text-dim)] font-light">Analysis</span></h2>
                                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--glow)] flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Neural Synthesis Complete
                                </p>
                            </div>
                            <button
                                onClick={() => setReport(null)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium text-sm transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                New Scan
                            </button>
                        </div>

                        <div className="p-8 md:p-12 relative">
                            {report.includes('No recent issues found') ? (
                                <div className="text-center py-16 px-6 bg-gradient-to-b from-white/[0.02] to-transparent rounded-3xl border border-white/5">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] border border-emerald-500/20">
                                        <Sparkles className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">Spotless Locality!</h3>
                                    <p className="text-[var(--text-dim)] text-lg max-w-lg mx-auto leading-relaxed">
                                        Our neural scan detected absolute zero active civic disruptions in <span className="font-bold text-white">{area}</span>. The infrastructure looks incredibly well-maintained.
                                    </p>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-lg max-w-none">
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-3xl font-black text-white mb-6 pb-4 border-b border-white/10" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-[var(--glow)] mt-10 mb-4 flex items-center gap-3 before:content-[''] before:block before:w-2 before:h-8 before:bg-[var(--glow)] before:rounded-full" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-8 mb-3" {...props} />,
                                            p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-6" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="space-y-3 mb-8" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-3 mb-8 text-gray-300" {...props} />,
                                            li: ({ node, ...props }) => (
                                                <li className="flex items-start gap-3 text-gray-300" {...props}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--glow)] mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(0,255,255,0.5)]"></span>
                                                    <div className="flex-1">{props.children}</div>
                                                </li>
                                            ),
                                            strong: ({ node, ...props }) => <strong className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded" {...props} />,
                                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[var(--glow)] bg-white/[0.02] py-2 pr-4 pl-6 italic text-gray-400 rounded-r-xl my-6" {...props} />
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
        </div>
    );
}
