const fs = require('fs');

function revertFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    const startMarker = '/* 1. Menu Pill Button */';
    const endMarker = '/* 2. Floating Menu Overlay */';

    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(endMarker);

    if (startIndex !== -1 && endIndex !== -1) {
        const originalBlock = "/* 1. Menu Pill Button */\n" +
".hamburger {\n" +
"    width: auto !important;\n" +
"    min-width: 76px !important;\n" +
"    height: 38px !important;\n" +
"    flex-direction: row !important;\n" +
"    align-items: center !important;\n" +
"    background: var(--nav-green) !important;\n" +
"    border-radius: 30px !important;\n" +
"    padding: 0 34px 0 12px !important;\n" +
"    position: relative;\n" +
"    justify-content: flex-start !important;\n" +
"    cursor: pointer;\n" +
"    border: 1px solid rgba(255, 255, 255, 0.1) !important;\n" +
"    flex-shrink: 0;\n" +
"}\n\n" +
".hamburger::before {\n" +
"    content: \"Menu\";\n" +
"    color: #fff;\n" +
"    font-family: var(--sans);\n" +
"    font-size: 14px;\n" +
"    font-weight: 500;\n" +
"    margin: 0;\n" +
"}\n\n" +
".hamburger span {\n" +
"    position: absolute;\n" +
"    right: 12px;\n" +
"    background: #fff !important;\n" +
"    transition: transform 0.3s ease, opacity 0.3s ease, top 0.3s ease, width 0.3s ease !important;\n" +
"}\n\n" +
"/* 2 lines design */\n" +
".hamburger span:nth-child(1) {\n" +
"    top: 13px;\n" +
"    width: 16px !important;\n" +
"    transform: none !important;\n" +
"}\n\n" +
".hamburger span:nth-child(2) {\n" +
"    top: 21px;\n" +
"    width: 20px !important;\n" +
"    opacity: 1 !important;\n" +
"    transform: none !important;\n" +
"}\n\n" +
".hamburger span:nth-child(3) {\n" +
"    display: none !important;\n" +
"}\n\n" +
"/* Open state for button */\n" +
".hamburger.open span:nth-child(1) {\n" +
"    top: 19px;\n" +
"    transform: none !important;\n" +
"    width: 22px !important;\n" +
"    right: 12px;\n" +
"}\n\n" +
".hamburger.open span:nth-child(2) {\n" +
"    top: 19px;\n" +
"    transform: none !important;\n" +
"    width: 22px !important;\n" +
"    opacity: 0 !important;\n" +
"}\n\n";

        content = content.substring(0, startIndex) + originalBlock + content.substring(endIndex);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Reverted', filePath);
    } else {
        console.log('Could not find markers in', filePath);
    }
}

revertFile('c:\\wamp64\\www\\startgold-wep\\css\\media.css');
revertFile('c:\\wamp64\\www\\startgold-wep\\stagingtest\\css\\media.css');
