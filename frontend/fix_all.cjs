const fs = require('fs');

// 1. Navbar.jsx: Huge premium upgrade
let navbarContent = fs.readFileSync('src/components/Navbar.jsx', 'utf8');
navbarContent = navbarContent.replace(
    'nav-unified__inner',
    'nav-unified__inner flex items-center justify-between w-full relative z-10'
);
navbarContent = navbarContent.replace(
    '<nav className="nav-unified glass relative">',
    '<nav className="nav-unified relative bg-black/40 backdrop-blur-2xl border border-white/5 rounded-full mx-4 mt-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-500 overflow-visible before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-r before:from-[var(--glow)]/10 before:via-transparent before:to-[var(--glow)]/10">'
);
navbarContent = navbarContent.replace(
    'className={`nav-unified-container ${!isVisible ? \'nav-hidden\' : \'\'}`}',
    'className={`nav-unified-container transition-all duration-500 z-[100] fixed top-0 w-full ${!isVisible ? \'-translate-y-full opacity-0\' : \'\'}`}'
);

if (!navbarContent.includes('gap-1 sm:gap-2')) {
    navbarContent = navbarContent.replace(
        '<div className="nav-unified__links">',
        '<div className="nav-unified__links flex items-center gap-1 sm:gap-2">'
    );
}

navbarContent = navbarContent.replace(
    '<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 panel glass rounded-xl border-[var(--border-clean)] shadow-xl flex flex-col p-2 gap-1 z-50 !bg-black/90 backdrop-blur-3xl">',
    '<div className="absolute top-full mt-4 right-0 w-48 panel glass rounded-2xl border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col p-2 gap-1 z-50 !bg-black/90 backdrop-blur-xl animate-scale-in origin-top-right">'
);
navbarContent = navbarContent.replace(
    'left-1/2 -translate-x-1/2 mb-4',
    'top-full right-0 mt-4'
); // double check 

fs.writeFileSync('src/components/Navbar.jsx', navbarContent);

// 2. Reduce white lines & fix radar + mobile animations in index.css
let cssContent = fs.readFileSync('src/index.css', 'utf8');

// Lower border-clean opacity
cssContent = cssContent.replace('--border-clean: rgba(255, 255, 255, 0.08);', '--border-clean: rgba(255, 255, 255, 0.04);');

// Make radar absolutely stunning
cssContent = cssContent.replace(
    '.radar-card {\n  position: relative;',
    '.radar-card {\n  position: relative;\n  background: radial-gradient(circle at center, rgba(0,255,255,0.08) 0%, rgba(0,0,0,0.5) 75%) !important;\n  border: 1px solid rgba(0,255,255,0.3) !important;\n  border-radius: 50% !important;\n  box-shadow: inset 0 0 50px rgba(0,255,255,0.1), 0 0 30px rgba(0,255,255,0.2) !important;\n  transform-style: preserve-3d;'
);

cssContent = cssContent.replace(
    `.radar {
  height: 260px;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  background: var(--bg-primary);
  border: 1px solid var(--border-clean);
}`,
    `.radar {
  height: 260px;
  width: 260px;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.2);
  box-shadow: inset 0 0 40px rgba(0,255,255,0.05);
}`
);

// Ensure mobile scroll animations work
if(!cssContent.includes('@media (max-width: 768px) { .scroll-animate')) {
cssContent = cssContent.replace(
    '.scroll-animate {',
    `@media (max-width: 768px) {
  .scroll-animate {
    transform: translateY(20px) !important;
  }
  .scroll-animate.zoom { transform: scale(0.95) translateY(10px) !important; }
  .scroll-animate.slide-left { transform: translateX(-15px) !important; }
  .scroll-animate.slide-right { transform: translateX(15px) !important; }
  
  .animate-play {
    transform: translate(0, 0) scale(1) !important;
    opacity: 1 !important;
  }
}

.scroll-animate {`
);
}

fs.writeFileSync('src/index.css', cssContent);

// 3. Fix App.jsx and Reports padding
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');
appJsx = appJsx.replace('pt-24 pb-12', 'pt-20 pb-8'); // less space
fs.writeFileSync('src/App.jsx', appJsx);

let reportJsx = fs.readFileSync('src/pages/CommunityReports.jsx', 'utf8');
reportJsx = reportJsx.replace('mt-16 md:mt-24', 'mt-4 md:mt-8');
reportJsx = reportJsx.replace('mt-4 md:mt-12', 'mt-4 md:mt-8'); // if previously edited
fs.writeFileSync('src/pages/CommunityReports.jsx', reportJsx);

console.log("Cleanup script done!");
