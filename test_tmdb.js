
const axios = require('axios');

async function testTMDB() {
    const title = 'Colossal';
    const year = 2017;

    // TMDB API - no key needed for search
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=2f27bfe3095d3e1cd5b4c6b19db8eb36&query=${encodeURIComponent(title)}&year=${year}`;

    try {
        console.log(`Searching TMDB for: ${title}`);
        const res = await axios.get(searchUrl);
        const movie = res.data.results?.[0];
        if (movie) {
            console.log(`Found: ${movie.title} (${movie.release_date})`);
            console.log(`TMDB ID: ${movie.id}`);
            console.log(`vidsrc URL: https://vidsrc.xyz/embed/movie/${movie.id}`);
        } else {
            console.log("No match found on TMDB.");
        }
    } catch (e) {
        console.error("TMDB search failed:", e.message);
    }
}

testTMDB();
