
const https = require('https');

const url = 'https://yts.mx/api/v2/list_movies.json?limit=5';

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("Success! Got movies:", json.data.movies.map(m => m.title));
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
            console.log("Raw Data:", data);
        }
    });
}).on('error', err => {
    console.error("Error fetching YTS:", err.message);
});
