const fs = require('fs');

const classes = ['h1', '\\.hero-h1', '\\.why-choose-title', '\\.stable-invest-title', '\\.sip-title', '\\.slide-heading', '\\.digi-gold-heading', '\\.faq-title', '\\.about-hero-heading', '\\.about-mv-heading', '\\.about-why-title', '\\.feat-showcase-heading', '\\.contact-info-heading', '\\.policy-heading', '\\.why-choose-sub', '\\.stable-invest-sub', '\\.sip-sub', '\\.about-why-sub'];

function processFile(filename, multiplier) {
    let css = fs.readFileSync(filename, 'utf8');
    
    let lines = css.split('\n');
    let inTargetBlock = false;
    const blockStartRegex = new RegExp(`(^|\\s)(` + classes.join('|') + `)(,|\\s*\\{)`);
    
    for(let i=0; i<lines.length; i++) {
        let line = lines[i];
        if (line.match(blockStartRegex)) {
            inTargetBlock = true;
        }
        if (inTargetBlock && line.includes('}')) {
            inTargetBlock = false;
        }
        if (inTargetBlock && line.match(/font-size:\s*([\d.]+)(px|rem|em)/)) {
            lines[i] = line.replace(/font-size:\s*([\d.]+)(px|rem|em)/, (match, val, unit) => {
                let newVal = parseFloat(val) * multiplier;
                if (unit === 'px') {
                    newVal = Math.round(newVal);
                } else {
                    newVal = newVal.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
                }
                return `font-size: ${newVal}${unit}`;
            });
        }
    }
    fs.writeFileSync(filename, lines.join('\n'), 'utf8');
    console.log(`Updated ${filename}`);
}

processFile('css/style.css', 0.75);
processFile('css/media.css', 0.85);
