
const axios = require('axios');
const fs = require('fs');

async function testSearch() {
    const host = 'h5.aoneroom.com';
    const baseUrl = `https://${host}`;

    const headers = {
        'X-Client-Info': JSON.stringify({ timezone: 'Asia/Jakarta' }),
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        'Referer': baseUrl + '/',
        'Host': host
    };

    const searchPath = '/wefeed-h5-bff/web/subject/search';

    try {
        console.log(`Searching for "Extraction II"...`);
        const response = await axios.post(baseUrl + searchPath, {
            keyword: 'Extraction II',
            page: 1,
            perPage: 10,
            subjectType: 1
        }, { headers });

        console.log("Search results items count:", response.data.data.items?.length);
        const item = response.data.data.items?.[0];
        console.log("First item sample:", JSON.stringify(item).substring(0, 500));

        fs.writeFileSync('search_results.json', JSON.stringify(response.data, null, 2));

        if (JSON.stringify(response.data).includes('playUrl')) console.log("FOUND playUrl in search results!");

    } catch (e) {
        console.error("Search failed:", e.message);
    }
}

testSearch();
