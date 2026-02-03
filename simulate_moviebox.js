
const axios = require('axios');
const fs = require('fs');

async function simulateMovieBox() {
    const host = 'h5.aoneroom.com';
    const baseUrl = `https://${host}`;
    const subjectId = '5659063570080875400'; // Extraction II (2023)
    const slug = 'extraction-ii-S9NYoEpz2K6';

    const client = axios.create({
        baseURL: baseUrl,
        headers: {
            'X-Client-Info': JSON.stringify({ timezone: 'Asia/Jakarta' }),
            'Accept-Language': 'en-US,en;q=0.5',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            'Referer': baseUrl + '/',
            'Host': host
        }
    });

    const cookies = {};

    client.interceptors.response.use((response) => {
        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
            setCookie.forEach(cookie => {
                const [nameValue] = cookie.split(';');
                const [name, value] = nameValue.split('=');
                cookies[name] = value;
            });
        }
        return response;
    });

    try {
        console.log("1. Initializing cookies via APP_INFO...");
        await client.get('/wefeed-h5-bff/app/get-latest-app-pkgs?app_name=moviebox');

        const cookieStr = Object.entries(cookies).map(([n, v]) => `${n}=${v}`).join('; ');
        console.log("Cookies:", cookieStr);

        console.log("2. Fetching movie page...");
        const response = await client.get(`/movies/${slug}?id=${subjectId}`, {
            headers: { Cookie: cookieStr }
        });

        const html = response.data;
        fs.writeFileSync('extraction_debug.html', html);
        console.log("Saved HTML. Length:", html.length);

        const keys = ['playUrl', 'videoUrl', 'm3u8', 'Extraction II'];
        keys.forEach(k => {
            if (html.includes(k)) console.log(`  FOUND "${k}"`);
            else console.log(`  NOT FOUND "${k}"`);
        });

        // Search for JSON blocks
        const scriptMatch = html.match(/window\.__NUXT__\s*=\s*(.*?);<\/script>/s);
        if (scriptMatch) {
            console.log("Found __NUXT__ block.");
            fs.writeFileSync('nuxt_state.txt', scriptMatch[1]);
        }

    } catch (e) {
        console.error("Simulation failed:", e.message);
    }
}

simulateMovieBox();
