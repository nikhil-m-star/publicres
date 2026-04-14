const fs = require('fs');
let cssContent = fs.readFileSync('src/index.css', 'utf8');

const splitIndex = cssContent.indexOf('/* Scroll Animations */');
if (splitIndex !== -1) {
  const safeContent = cssContent.substring(0, splitIndex);
  const newEnding = `
/* Scroll Animations - Premium Mobile & Desktop */
.scroll-animate {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.scroll-animate.zoom {
    transform: scale(0.9) translateY(20px);
}
.scroll-animate.slide-left {
    transform: translateX(-40px);
}
.scroll-animate.slide-right {
    transform: translateX(40px);
}

.animate-play {
    opacity: 1 !important;
    transform: translateY(0) scale(1) translateX(0) !important;
}

@media (max-width: 768px) {
  .scroll-animate {
    transform: translateY(20px);
  }
  .scroll-animate.zoom {
    transform: scale(0.95) translateY(10px);
  }
  .scroll-animate.slide-left {
    transform: translateX(-15px);
  }
  .scroll-animate.slide-right {
    transform: translateX(15px);
  }
}
`;
  fs.writeFileSync('src/index.css', safeContent + newEnding);
}
