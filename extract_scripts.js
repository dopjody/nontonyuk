
const fs = require('fs');
const content = fs.readFileSync('debug_moviebox_headers.html', 'utf-8');

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
let match;
let count = 0;

while ((match = scriptRegex.exec(content)) !== null) {
    count++;
    const scriptBody = match[1].trim();
    console.log(`--- Script ${count} (Length: ${scriptBody.length}) ---`);
    if (scriptBody.length > 0) {
        console.log(scriptBody.substring(0, 500));
        if (scriptBody.includes('subjectId')) {
            console.log("!!! FOUND subjectId in this script !!!");
            fs.writeFileSync(`script_${count}.js`, scriptBody);
        }
    }
}
