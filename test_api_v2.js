
const axios = require('axios');
const fs = require('fs');

async function testApi() {
    const host = 'h5.aoneroom.com';
    const baseUrl = `https://${host}`;
    const subjectId = '2310728721344383704'; // Action (2013)

    const headers = {
        'X-Client-Info': JSON.stringify({ timezone: 'Asia/Jakarta' }),
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0',
        'Referer': baseUrl + '/',
        'Host': host
    };

    // try various likely API paths
    const paths = [
        `/wefeed-h5-bff/web/subject/detail?subjectId=${subjectId}`,
        `/wefeed-h5-bff/web/subject/info?subjectId=${subjectId}`,
        `/wefeed-h5-bff/web/subject/play-info?subjectId=${subjectId}`,
        `/wefeed-h5-bff/web/subject/detail?id=${subjectId}`
    ];

    for (const apiPath of paths) {
        try {
            console.log(`Testing ${apiPath}...`);
            const response = await axios.get(baseUrl + apiPath, { headers });
            console.log(`  SUCCESS! Status: ${response.status}`);
            fs.writeFileSync(`api_res_${apiPath.replace(/[^a-z]/g, '_')}.json`, JSON.stringify(response.data, null, 2));
            if (JSON.stringify(response.data).includes('playUrl')) {
                console.log("  !!! FOUND playUrl in this API response !!!");
            }
        } catch (e) {
            console.log(`  FAILED: ${e.message}`);
        }
    }
}

testApi();
