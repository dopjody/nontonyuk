
const axios = require('axios');
const fs = require('fs');

async function testFetch() {
    const subjectId = '3306411007240717352'; // Colossal
    const slug = 'colossal-AucaoXDofW3';
    const host = 'h5.aoneroom.com';
    const baseUrl = `https://${host}`;

    const headers = {
        'X-Client-Info': JSON.stringify({ timezone: 'Asia/Jakarta' }),
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        'Referer': baseUrl + '/',
        'Host': host
    };

    const paths = [
        `/movies/${slug}?id=${subjectId}`,
        `/detail?id=${subjectId}&scene&page_from=search_detail&type=%2Fmovie%2Fdetail`
    ];

    for (const p of paths) {
        try {
            console.log(`Fetching from ${baseUrl}${p}...`);
            const response = await axios.get(baseUrl + p, { headers });
            const html = response.data;
            console.log(`  Length: ${html.length}`);
            if (html.includes('playUrl')) console.log("  FOUND playUrl!");
            if (html.includes('__NUXT__')) console.log("  FOUND __NUXT__!");
            fs.writeFileSync(`test_res_${p.replace(/[^a-z]/g, '_')}.html`, html);
        } catch (e) {
            console.error(`  Fetch failed: ${e.message}`);
        }
    }
}

testFetch();
