const fs = require('fs');

function updateFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');

    // We start from the currently REVERTED state, which has the "Menu" text and 2 lines.
    // Let's replace the .hamburger block to make it the 3-line circle.
    
    const startMarker = '/* 1. Menu Pill Button */';
    const endMarker = '/* 2. Floating Menu Overlay */';

    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(endMarker);

    if (startIndex !== -1 && endIndex !== -1) {
        const newBlock = \`/* 1. Menu Pill Button */
.hamburger {
    width: 38px !important;
    min-width: 38px !important;
    height: 38px !important;
    flex-direction: column !important;
    align-items: flex-end !important;
    justify-content: space-between !important;
    background: var(--nav-green) !important;
    border-radius: 50% !important;
    padding: 12px 9px !important;
    position: relative;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    flex-shrink: 0;
}

.hamburger::before {
    display: none !important;
}

.hamburger span {
    display: block !important;
    position: relative !important;
    left: auto !important;
    right: auto !important;
    transform: none !important;
    background: #fff !important;
    transition: .3s !important;
    height: 2px !important;
    border-radius: 2px !important;
}

.hamburger span:nth-child(1) {
    top: auto !important;
    width: 65% !important;
}

.hamburger span:nth-child(2) {
    top: auto !important;
    width: 100% !important;
    opacity: 1 !important;
}

.hamburger span:nth-child(3) {
    display: block !important;
    top: auto !important;
    width: 60% !important;
}

/* Open state for button (Minus sign - Old Design) */
.hamburger.open span:nth-child(1) {
    position: absolute !important;
    top: 18px !important;
    transform: none !important;
    width: 22px !important;
    right: 7px !important;
}

.hamburger.open span:nth-child(2) {
    opacity: 0 !important;
}

.hamburger.open span:nth-child(3) {
    opacity: 0 !important;
    transform: none !important;
}

\`;
        content = content.substring(0, startIndex) + newBlock + content.substring(endIndex);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated to 3-line circle with old close icon', filePath);
    } else {
        console.log('Could not find markers in', filePath);
    }
}

updateFile('c:\\wamp64\\www\\startgold-wep\\css\\media.css');
updateFile('c:\\wamp64\\www\\startgold-wep\\stagingtest\\css\\media.css');
