
const axios = require('axios');
const https = require('https');

async function testMapping() {
    const title = 'Colossal';
    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
        const url = `https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(title)}&limit=1`;
        console.log(`Searching YTS: ${url}`);
        const res = await axios.get(url, { httpsAgent: agent });
        const movie = res.data.data.movies?.[0];
        if (movie) {
            console.log(`Found: ${movie.title} (${movie.year})`);
            console.log(`IMDB Code: ${movie.imdb_code}`);
            console.log(`vidsrc URL: https://vidsrc.xyz/embed/movie/${movie.imdb_code}`);
        } else {
            console.log("No match found on YTS.");
        }
    } catch (e) {
        console.error("YTS Mapping failed:", e.message);
    }
}

testMapping();
