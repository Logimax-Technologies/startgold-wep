const fs = require('fs');
let css = fs.readFileSync('c:/wamp64/www/startgold/css/style.css', 'utf8');

css = css.replace(/font-size:\s*(\d*\.?\d+)px/g, (match, p1) => {
    let num = parseFloat(p1);
    if (num < 8) return match;
    const rem = (num / 16).toFixed(4).replace(/\.?0+$/, '') + 'rem';
    return 'font-size: ' + rem;
});

css = css.replace(/border-radius:\s*((?:\d*\.?\d+px\s*)+)/g, (match, p1) => {
    const parts = p1.trim().split(/\s+/).map(part => {
        if (part.endsWith('px')) {
            let num = parseFloat(part);
            if (num === 0) return '0';
            return (num / 16).toFixed(4).replace(/\.?0+$/, '') + 'rem';
        }
        return part;
    });
    return 'border-radius: ' + parts.join(' ');
});

const regexMedia = /@media\s*\(min-width:\s*1440px\)[\s\S]+?@media\s*\(min-width:\s*1920px\)[\s\S]+?\}/g;

const rootScaling = `html {
    font-size: 16px;
}

@media (min-width: 1440px) {
    html {
        font-size: 18px; /* Scales all rem font-sizes & border-radii by +12.5% */
    }
}

@media (min-width: 1920px) {
    html {
        font-size: 22px; /* Scales by +37.5% */
    }
}`;

if (css.match(regexMedia)) {
    css = css.replace(regexMedia, rootScaling);
} else {
    css += '\n\n' + rootScaling;
}

fs.writeFileSync('c:/wamp64/www/startgold/css/style.css', css);
console.log('Successfully replaced px sizes and updated media query.');
