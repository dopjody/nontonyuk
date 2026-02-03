
const axios = require('axios');
const fs = require('fs');

async function testApi() {
    const host = 'h5.aoneroom.com';
    const baseUrl = `https://${host}`;

    const headers = {
        'X-Client-Info': JSON.stringify({ timezone: 'Asia/Jakarta' }),
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0',
        'Referer': baseUrl + '/',
        'Host': host
    };

    const apiPath = '/wefeed-h5-bff/app/get-latest-app-pkgs?app_name=moviebox';

    try {
        console.log(`Fetching API from ${baseUrl}${apiPath}...`);
        const response = await axios.get(baseUrl + apiPath, { headers });
        console.log("API Response Status:", response.status);
        console.log("API Response Data:", JSON.stringify(response.data).substring(0, 500));
        fs.writeFileSync('api_response.json', JSON.stringify(response.data, null, 2));
    } catch (e) {
        console.error("API Fetch failed:", e.message);
        if (e.response) {
            console.error("Response data:", e.response.data);
        }
    }
}

testApi();
