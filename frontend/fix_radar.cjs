const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf-8');

// I'll just use regex to match from .radar-card { to the end of the broken block and replace it cleanly.
// The problem is from .radar-card { down to the orphaned }

const target = `.radar-card {
  position: relative;
  background: radial-gradient(circle at center, rgba(0,255,255,0.08) 0%, rgba(0,0,0,0.5) 75%) !important;
  border: 1px solid rgba(0,255,255,0.3) !important;
  border-radius: 50% !important;
  box-shadow: inset 0 0 50px rgba(0,255,255,0.1), 0 0 30px rgba(0,255,255,0.2) !important;
  transform-style: preserve-3d;
  background: radial-gradient(circle at center, rgba(0,255,255,0.05) 0%, transparent 70%);
  border: 1px solid rgba(0,255,255,0.2);
  border-radius: 50%;
  overflow: hidden;
  box-shadow: inset 0 0 50px rgba(0,255,255,0.05), 0 0 30px rgba(0,255,255,0.1);
}
  background: var(--bg-secondary);
  border: 1px solid var(--border-clean);
  border-radius: 28px;
  padding: 24px;
  position: relative;
}`;

const replacement = `.radar-container-wrap {
  background: var(--bg-secondary);
  border: 1px solid var(--border-clean);
  border-radius: 28px;
  padding: 24px;
  position: relative;
}

.radar-card {
  position: relative;
  background: radial-gradient(circle at center, rgba(0,255,255,0.08) 0%, rgba(0,0,0,0.5) 75%) !important;
  border: 1px solid rgba(0,255,255,0.3) !important;
  border-radius: 50% !important;
  box-shadow: inset 0 0 80px rgba(0,255,255,0.15), 0 0 40px rgba(0,255,255,0.2) !important;
  transform-style: preserve-3d;
  padding: 2rem;
  overflow: visible;
}`;

css = css.replace(target, replacement);

// The problem might be another radar target block too so we should just fix the corrupted part.
fs.writeFileSync('src/index.css', css);
