const fs = require('fs');

// 1. Fix CommunityReports.jsx top spacing
let reportsContent = fs.readFileSync('src/pages/CommunityReports.jsx', 'utf8');
reportsContent = reportsContent.replace(
    '<div className="page-container py-12 md:py-24 mt-16 md:mt-24 relative z-10 w-full min-h-screen">',
    '<div className="page-container py-6 md:py-12 mt-4 md:mt-12 relative z-10 w-full min-h-screen">'
);
reportsContent = reportsContent.replace(
    '<div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">',
    '<div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">'
);
fs.writeFileSync('src/pages/CommunityReports.jsx', reportsContent);

// 2. Fix IssueCard.jsx category UI & spacing
let issueCardContent = fs.readFileSync('src/components/IssueCard.jsx', 'utf8');
issueCardContent = issueCardContent.replace(
    '<div className="flex items-center gap-3">',
    '<div className="flex flex-wrap items-center gap-2 mb-2">'
);
issueCardContent = issueCardContent.replace(
    '<span className={`category-badge ${catClass}`}>',
    '<span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border bg-black/40 shadow-sm transition-all hover:scale-105 ${catClass}`}>'
);
issueCardContent = issueCardContent.replace(
    '<span className="category-badge category-other">',
    '<span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide border border-[var(--border-clean)] bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors">'
);
fs.writeFileSync('src/components/IssueCard.jsx', issueCardContent);

// 3. Improve radar UI and animations in index.css
let cssContent = fs.readFileSync('src/index.css', 'utf8');
cssContent = cssContent.replace(
    '.scroll-animate {',
    '@media (max-width: 768px) {\n  .scroll-animate {\n    transform: translateY(20px);\n  }\n  .scroll-animate.zoom { transform: scale(0.95); }\n  .scroll-animate.slide-left { transform: translateX(-20px); }\n  .scroll-animate.slide-right { transform: translateX(20px); }\n}\n\n.scroll-animate {'
);

cssContent = cssContent.replace(
    '.radar-card {',
    '.radar-card {\n  position: relative;\n  background: radial-gradient(circle at center, rgba(0,255,255,0.05) 0%, transparent 70%);\n  border: 1px solid rgba(0,255,255,0.2);\n  border-radius: 50%;\n  overflow: hidden;\n  box-shadow: inset 0 0 50px rgba(0,255,255,0.05), 0 0 30px rgba(0,255,255,0.1);\n}'
);

fs.writeFileSync('src/index.css', cssContent);

