
const fs = require('fs');
const c = fs.readFileSync('script_3.js', 'utf-8');

const keys = ['playUrl', 'videoUrl', 'm3u8', 'vidsrc', 'embed'];

keys.forEach(k => {
    const idx = c.indexOf(k);
    if (idx !== -1) {
        console.log(`FOUND ${k} at ${idx}`);
        console.log("Context:", c.substring(idx - 100, idx + 500));
    } else {
        console.log(`NOT FOUND ${k}`);
    }
});
