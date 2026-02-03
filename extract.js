
const fs = require('fs');
const content = fs.readFileSync('debug_moviebox.html', 'utf-8');

console.log("File length:", content.length);

const keywords = ['playUrl', 'videoUrl', 'm3u8', 'mp4', 'cloudvideo', 'pbcdnw', 'subjectId'];

keywords.forEach(key => {
    const index = content.indexOf(key);
    if (index !== -1) {
        console.log(`Found "${key}" at index ${index}`);
        console.log("Context:", content.substring(index - 100, index + 300));
    } else {
        console.log(`"${key}" NOT found.`);
    }
});
