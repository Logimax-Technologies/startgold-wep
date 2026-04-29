const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'style.css');
const mediaPath = path.join(__dirname, 'css', 'media.css');

let content = fs.readFileSync(cssPath, 'utf8');
let outMedia = "/* Responsive Media Queries extracted from style.css */\n\n";
let outStyle = "";

let i = 0;
while (i < content.length) {
    let nextMedia = content.indexOf('@media', i);
    if (nextMedia === -1) {
        outStyle += content.substring(i);
        break;
    }

    outStyle += content.substring(i, nextMedia);
    let j = nextMedia;
    let openBraces = 0;
    let foundOpen = false;
    let inString = false;
    let stringChar = '';
    let inComment = false;

    while (j < content.length) {
        let char = content[j];
        let nextChar = content[j+1];

        if (inComment) {
            if (char === '*' && nextChar === '/') {
                inComment = false;
                j++;
            }
        } else if (inString) {
            if (char === '\\') j++; // skip escaped
            else if (char === stringChar) inString = false;
        } else {
            if (char === '/' && nextChar === '*') {
                inComment = true;
                j++;
            } else if (char === "'" || char === '"') {
                inString = true;
                stringChar = char;
            } else if (char === '{') {
                openBraces++;
                foundOpen = true;
            } else if (char === '}') {
                openBraces--;
                if (foundOpen && openBraces === 0) {
                    j++;
                    break;
                }
            }
        }
        j++;
    }

    let mediaBlock = content.substring(nextMedia, j);
    outMedia += mediaBlock + "\n\n";
    i = j;
}

fs.writeFileSync(mediaPath, outMedia, 'utf8');
fs.writeFileSync(cssPath, outStyle, 'utf8');
console.log("Successfully extracted @media blocks.");
