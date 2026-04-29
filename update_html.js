const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (let file of files) {
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('css/media.css')) {
        continue; // Already added
    }
    
    // Look for style.css
    let styleTag = '<link rel="stylesheet" href="css/style.css">';
    if (content.includes(styleTag)) {
        content = content.replace(styleTag, styleTag + '\n    <link rel="stylesheet" href="css/media.css">');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated " + file);
    } else {
        // trying without quotes or different spacing
        let flexRegex = /<link[^>]*href=["']css\/style\.css["'][^>]*>/i;
        let match = content.match(flexRegex);
        if (match) {
            content = content.replace(match[0], match[0] + '\n    <link rel="stylesheet" href="css/media.css">');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log("Updated " + file);
        }
    }
}
console.log("HTML updates complete.");
