const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const htmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf-8');

// Step 1: Replace Vite's ESM script tag with plain IIFE script tag
html = html.replace(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
  '<script defer src="$1"><\/script>'
);

// Step 2: Remove any modulepreload links (not needed for IIFE)
html = html.replace(/<link rel="modulepreload"[^>]*>\n?/g, '');

fs.writeFileSync(htmlPath, html);
console.log('✓ dist/index.html fixed for file:// protocol (type=module removed, defer added)');
