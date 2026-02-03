
const axios = require('axios');
const fs = require('fs');

async function testFetch() {
    const subjectId = '74738785354956752'; // Avatar
    const host = 'h5.aoneroom.com';
    const baseUrl = `https://${host}`;

    const headers = {
        'X-Client-Info': JSON.stringify({ timezone: 'Asia/Jakarta' }),
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0',
        'Referer': baseUrl + '/',
        'Host': host
    };

    console.log("Fetching with headers...");
    const detailPath = `/detail?id=${subjectId}&scene&page_from=search_detail&type=%2Fmovie%2Fdetail`;

    try {
        const response = await axios.get(baseUrl + detailPath, { headers });
        const html = response.data;
        fs.writeFileSync('debug_moviebox_headers.html', html);
        console.log("Saved to debug_moviebox_headers.html. Length:", html.length);

        if (html.includes('playUrl')) console.log("FOUND playUrl!");
        if (html.includes('videoUrl')) console.log("FOUND videoUrl!");
        if (html.includes('__NEXT_DATA__')) console.log("FOUND __NEXT_DATA__!");

        const nextDataMatch = html.match(/__NEXT_DATA__\s*=\s*({.*?});/s);
        if (nextDataMatch) {
            console.log("Found NEXT_DATA JSON block.");
            const json = JSON.parse(nextDataMatch[1]);
            fs.writeFileSync('next_data.json', JSON.stringify(json, null, 2));
            console.log("Saved NEXT_DATA to next_data.json");
        } else {
            console.log("NEXT_DATA NOT found even with regex.");
        }

    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
}

testFetch();
