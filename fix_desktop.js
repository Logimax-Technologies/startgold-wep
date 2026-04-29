const fs = require('fs');

const headings42 = ['h1', '\\.hero-h1', '\\.why-choose-title', '\\.stable-invest-title', '\\.sip-title', '\\.slide-heading', '\\.digi-gold-heading', '\\.faq-title', '\\.about-hero-heading', '\\.about-mv-heading', '\\.about-why-title', '\\.feat-showcase-heading', '\\.contact-info-heading'];
const subs22 = ['\\.why-choose-sub', '\\.stable-invest-sub', '\\.sip-sub', '\\.about-why-sub'];
const policy = ['\\.policy-heading'];

let css = fs.readFileSync('css/style.css', 'utf8');

function resetSizes(classList, sizeStr) {
    const blockStartRegex = new RegExp(`(^|\\s)(` + classList.join('|') + `)(,|\\s*\\{)`);
    let lines = css.split('\n');
    let inTargetBlock = false;
    for(let i=0; i<lines.length; i++) {
        let line = lines[i];
        if (line.match(blockStartRegex)) {
            inTargetBlock = true;
        }
        if (inTargetBlock && line.includes('}')) {
            inTargetBlock = false;
        }
        if (inTargetBlock && line.match(/font-size:\s*([\d.]+)(px|rem|em)/)) {
            lines[i] = line.replace(/font-size:\s*([\d.]+)(px|rem|em)/, `font-size: ${sizeStr}`);
        }
    }
    css = lines.join('\n');
}

resetSizes(headings42, '42px');
resetSizes(subs22, '22px');
resetSizes(policy, '1.35rem');

fs.writeFileSync('css/style.css', css, 'utf8');
console.log("Restored style.css desktop sizes.");
