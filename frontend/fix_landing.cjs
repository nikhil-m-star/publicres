const fs = require('fs');

let content = fs.readFileSync('src/pages/Landing.jsx', 'utf8');

// Add hook import
content = content.replace("import { Link, useLocation } from 'react-router-dom'", "import { Link, useLocation } from 'react-router-dom'\nimport { useScrollAnimation } from '../hooks/useScrollAnimation'");

// Add hook call
content = content.replace("const { data } = useIssues({ limit: 50 })", "const { data } = useIssues({ limit: 50 })\n    useScrollAnimation()");

// Add scroll-animate tags
content = content.replace('<section className="hero relative z-10 pt-24 pb-16">', '<section className="hero relative z-10 pt-24 pb-16 scroll-animate">');
content = content.replace('<section className="py-20 relative z-10 hero__features-section border-t border-[var(--border-clean)] bg-black/40">', '<section className="py-20 relative z-10 hero__features-section border-t border-[var(--border-clean)] bg-black/40 scroll-animate zoom">');
content = content.replace('<section className="py-24 relative z-10 hero__stats-section">', '<section className="py-24 relative z-10 hero__stats-section scroll-animate">');
content = content.replace('<section className="py-20 bg-black/60 relative z-10 border-t border-[var(--border-clean)]">', '<section className="py-20 bg-black/60 relative z-10 border-t border-[var(--border-clean)] scroll-animate zoom">');
content = content.replace('<section className="py-32 relative z-10 max-w-4xl mx-auto px-6 text-center panel glass border border-[var(--border-clean)] rounded-[3rem] my-20 shadow-[0_0_50px_rgba(0,255,255,0.05)]">', '<section className="py-32 relative z-10 max-w-4xl mx-auto px-6 text-center panel glass border border-[var(--border-clean)] rounded-[3rem] my-20 shadow-[0_0_50px_rgba(0,255,255,0.05)] scroll-animate slide-right">');

fs.writeFileSync('src/pages/Landing.jsx', content);

