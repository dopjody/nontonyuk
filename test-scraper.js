/**
 * Test Script: Verify MovieBox Video URL Extraction
 * Run with: node test-scraper.js
 */

const axios = require('axios');
const cheerio = require('cheerio');

const MIRROR_HOSTS = [
    'h5.aoneroom.com',
    'moviebox.ph',
    'moviebox.id',
];

const SELECTED_HOST = MIRROR_HOSTS[0];
const HOST_URL = `https://${SELECTED_HOST}`;

const DEFAULT_HEADERS = {
    'X-Client-Info': JSON.stringify({ timezone: 'Asia/Jakarta' }),
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0',
    'Referer': HOST_URL + '/',
};

const client = axios.create({
    baseURL: HOST_URL,
    headers: DEFAULT_HEADERS,
    timeout: 15000
});

async function testVideoExtraction(subjectId) {
    console.log(`\n========================================`);
    console.log(`🎬 Testing Video Extraction for ID: ${subjectId}`);
    console.log(`Host: ${HOST_URL}`);
    console.log(`========================================\n`);

    const detailPath = `/detail?id=${subjectId}&scene&page_from=search_detail&type=%2Fmovie%2Fdetail`;
    console.log(`📍 Fetching: ${HOST_URL}${detailPath}\n`);

    try {
        const { data: html, status } = await client.get(detailPath);
        console.log(`✅ Response Status: ${status}`);
        console.log(`📄 HTML Length: ${html.length} characters\n`);

        const $ = cheerio.load(html);

        // Extract title from meta
        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const cover = $('meta[property="og:image"]').attr('content');
        console.log(`📽️ Title: ${title}`);
        console.log(`🖼️ Cover: ${cover}\n`);

        // Search for video URLs in the HTML
        console.log(`🔍 Searching for video URLs...\n`);

        // Method 1: playUrl
        const playUrlMatch = html.match(/"playUrl":"(.*?)"/);
        if (playUrlMatch) {
            const playUrl = JSON.parse(`"${playUrlMatch[1]}"`);
            console.log(`✅ Found playUrl: ${playUrl.substring(0, 100)}...`);
        } else {
            console.log(`❌ playUrl NOT found`);
        }

        // Method 2: videoUrl
        const videoUrlMatch = html.match(/"videoUrl":"(.*?)"/);
        if (videoUrlMatch) {
            const videoUrl = JSON.parse(`"${videoUrlMatch[1]}"`);
            console.log(`✅ Found videoUrl: ${videoUrl.substring(0, 100)}...`);
        } else {
            console.log(`❌ videoUrl NOT found`);
        }

        // Method 3: m3u8 links
        const m3u8Matches = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/g);
        if (m3u8Matches && m3u8Matches.length > 0) {
            console.log(`\n✅ Found ${m3u8Matches.length} M3U8 links:`);
            m3u8Matches.forEach((url, i) => {
                console.log(`   ${i + 1}. ${url.substring(0, 80)}...`);
            });
        } else {
            console.log(`❌ No M3U8 links found`);
        }

        // Method 4: MP4 links
        const mp4Matches = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/g);
        if (mp4Matches && mp4Matches.length > 0) {
            console.log(`\n✅ Found ${mp4Matches.length} MP4 links:`);
            mp4Matches.forEach((url, i) => {
                console.log(`   ${i + 1}. ${url.substring(0, 80)}...`);
            });
        } else {
            console.log(`❌ No MP4 links found`);
        }

        // Method 5: Check for NEXT_DATA
        let hasNextData = false;
        $('script').each((_, script) => {
            const content = $(script).html();
            if (content && content.includes('__NEXT_DATA__')) {
                hasNextData = true;
                console.log(`\n✅ Found __NEXT_DATA__ script tag`);
                // Try to extract and parse
                const match = content.match(/__NEXT_DATA__\s*=\s*({.*});/s);
                if (match) {
                    try {
                        const data = JSON.parse(match[1]);
                        console.log(`   Props keys: ${Object.keys(data.props?.pageProps || {}).join(', ')}`);
                    } catch (e) {
                        console.log(`   ⚠️ Could not parse NEXT_DATA JSON`);
                    }
                }
            }
        });
        if (!hasNextData) {
            console.log(`\n❌ __NEXT_DATA__ NOT found`);
        }

        // Validate a found URL
        const videoUrl = playUrlMatch ? JSON.parse(`"${playUrlMatch[1]}"`) :
            videoUrlMatch ? JSON.parse(`"${videoUrlMatch[1]}"`) :
                (m3u8Matches && m3u8Matches[0]) ? m3u8Matches[0] : null;

        if (videoUrl) {
            console.log(`\n🧪 Testing Video URL Accessibility...`);
            console.log(`   URL: ${videoUrl.substring(0, 100)}...`);
            try {
                const videoRes = await axios.head(videoUrl, { timeout: 10000 });
                console.log(`   ✅ HEAD Request Status: ${videoRes.status}`);
                console.log(`   Content-Type: ${videoRes.headers['content-type']}`);
                console.log(`   Content-Length: ${videoRes.headers['content-length']} bytes`);
            } catch (e) {
                console.log(`   ❌ HEAD Request Failed: ${e.message}`);
            }
        } else {
            console.log(`\n⚠️ No video URL to test.`);
        }

    } catch (error) {
        console.error(`\n❌ Error during scraping: ${error.message}`);
        if (error.response) {
            console.error(`   Response Status: ${error.response.status}`);
        }
    }

    console.log(`\n========================================`);
    console.log(`Test Complete`);
    console.log(`========================================\n`);
}

// Test with a known MovieBox ID (Avatar 2 or similar trending movie)
// You can replace this ID with any valid MovieBox subject ID
const TEST_ID = '255531'; // Example ID - should be a popular movie

testVideoExtraction(TEST_ID);
