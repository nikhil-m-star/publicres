const fs = require('fs');
let content = fs.readFileSync('src/pages/Leaderboard.jsx', 'utf8');

// Replace gradient bg
content = content.replace('bg-gradient-to-b from-amber-500/5 via-[var(--glow)]/5 to-transparent', 'bg-gradient-to-b from-[var(--glow)]/5 via-[var(--glow)]/5 to-transparent');

// Replace Trophy icon colors
content = content.replace('border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.15)]', 'border-[var(--glow)]/30 shadow-[0_0_30px_rgba(0,255,255,0.15)]');
content = content.replace('text-amber-400', 'text-[var(--glow)]');

// Replace Rank badge colors
content = content.replace('bg-amber-500/20 border border-amber-400/50 rounded-full flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]', 'bg-[var(--glow)]/20 border border-[var(--glow)]/50 rounded-full flex items-center justify-center text-[var(--glow)] shadow-[0_0_20px_rgba(0,255,255,0.4)]');
content = content.replace('bg-gray-300/20 border border-gray-300/50 rounded-full flex items-center justify-center text-gray-300 shadow-[0_0_20px_rgba(209,213,219,0.2)]', 'bg-white/20 border border-white/50 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]');
content = content.replace('bg-orange-700/20 border border-orange-600/50 rounded-full flex items-center justify-center text-orange-500 shadow-[0_0_20px_rgba(194,65,12,0.3)]', 'bg-[var(--text-muted)]/20 border border-[var(--text-dim)]/50 rounded-full flex items-center justify-center text-[var(--text-dim)] shadow-[0_0_20px_rgba(255,255,255,0.1)]');

// Replace Role Colors
content = content.replace("'bg-purple-500/10 text-purple-400 border-purple-500/20'", "'bg-[var(--glow)]/10 text-[var(--glow)] border-[var(--glow)]/20'");
content = content.replace("'bg-blue-500/10 text-blue-400 border-blue-500/20'", "'bg-white/10 text-white border-white/20'");

// Replace Star colors
content = content.replace('text-amber-500/50', 'text-[var(--glow)]/50');
content = content.replace('text-emerald-500/50', 'text-[var(--glow)]/50');

fs.writeFileSync('src/pages/Leaderboard.jsx', content);
