/**
 * Cache Buster — Auto-version all CSS & JS references in HTML files.
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  THIS IS YOUR SINGLE SOURCE OF TRUTH FOR VERSIONING
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Run after ANY change to CSS, JS, or images:
 *     node cache-bust.js
 *
 * What it does:
 *   - Generates a unique version (timestamp)
 *   - Stamps ?v=<version> on every local CSS & JS in ALL HTML files
 *   - Stamps background url() in style.css & media.css
 *   - Browsers fetch fresh files immediately — no user action needed
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const VERSION = Date.now(); // Auto-generated unique version every run

// ── 1. Version all local CSS & JS links in HTML files ──
const htmlFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join(DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Match href="css/..." or href="js/..." or src="js/..."
    // Handles existing ?v=xxx query strings — replaces them
    const localAssetPattern = /((?:href|src)\s*=\s*")((?:css|js)\/[^"?]+)(\?v=[^"]*)?(")/g;

    content = content.replace(localAssetPattern, (match, prefix, assetPath, oldVersion, suffix) => {
        changed = true;
        return `${prefix}${assetPath}?v=${VERSION}${suffix}`;
    });

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ ${file}`);
    }
});

// ── 2. Version background-image url() in CSS files ──
const cssFiles = ['css/style.css', 'css/media.css'];

cssFiles.forEach(cssFile => {
    const cssPath = path.join(DIR, cssFile);
    if (!fs.existsSync(cssPath)) return;

    let content = fs.readFileSync(cssPath, 'utf8');
    let changed = false;

    const urlPattern = /(url\(\s*['"]?)((?!data:|https?:|\/\/)[^'")?\s]+)(\?v=[^'")]*)?(['"]?\s*\))/g;

    content = content.replace(urlPattern, (match, prefix, assetPath, oldVersion, suffix) => {
        changed = true;
        return `${prefix}${assetPath}?v=${VERSION}${suffix}`;
    });

    if (changed) {
        fs.writeFileSync(cssPath, content, 'utf8');
        console.log(`  ✅ ${cssFile}`);
    }
});

console.log(`\n  🎯 Done! Version: ${VERSION}`);
console.log('  All browsers will load fresh files now.\n');
