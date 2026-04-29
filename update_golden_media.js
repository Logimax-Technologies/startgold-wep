const fs = require('fs');

let css = fs.readFileSync('css/media.css', 'utf8');

const blockStartRegex = /(^|\s)(\.golden-heading)(,|\s*\{)/;
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
        lines[i] = line.replace(/font-size:\s*([\d.]+)(px|rem|em)/, (match, val, unit) => {
            let newVal = parseFloat(val) * 0.85;
            if (unit === 'px') {
                newVal = Math.round(newVal);
            } else {
                newVal = newVal.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
            }
            return `font-size: ${newVal}${unit}`;
        });
    }
}

fs.writeFileSync('css/media.css', lines.join('\n'), 'utf8');
console.log("Reduced .golden-heading in media.css by 15%.");
