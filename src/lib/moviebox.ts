
import axios from 'axios';
import * as cheerio from 'cheerio';

// Configuration
const MIRROR_HOSTS = [
    'h5.aoneroom.com',
    'moviebox.ph',
    'moviebox.id',
    'moviebox.pk',
];
const SELECTED_HOST = MIRROR_HOSTS[0];
const HOST_URL = `https://${SELECTED_HOST}`;

const DEFAULT_HEADERS = {
    'X-Client-Info': JSON.stringify({ timezone: 'Asia/Jakarta' }),
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0',
    'Referer': HOST_URL + '/',
    'Host': SELECTED_HOST
};

const client = axios.create({
    baseURL: HOST_URL,
    headers: DEFAULT_HEADERS,
    timeout: 10000
});

export interface VideoSource {
    url: string;
    quality?: string;
    format?: string;
}

export async function getMovieBoxVideo(subjectId: string): Promise<VideoSource | null> {
    console.log(`🎬 Fetching video for ID: ${subjectId} from ${HOST_URL}`);

    // Construct detail path similar to original scraper
    const detailPath = `/detail?id=${subjectId}&scene&page_from=search_detail&type=%2Fmovie%2Fdetail`;

    try {
        // Fetch the HTML page
        const { data: html } = await client.get(detailPath);
        const $ = cheerio.load(html);

        // 1. Try to find __NEXT_DATA__
        let detailData: any = null;

        $('script').each((_, script) => {
            const content = $(script).html();
            if (content && content.includes('__NEXT_DATA__')) {
                const match = content.match(/__NEXT_DATA__\s*=\s*({.*?});/s);
                if (match) {
                    try {
                        detailData = JSON.parse(match[1]);
                    } catch (e) {
                        console.error('Error parsing NEXT_DATA', e);
                    }
                }
            }
        });

        // 2. Extract video URL from props
        // Note: The structure of NEXT_DATA varies, we look for pageProps using the ID
        if (detailData) {
            // Traverse finding logic specific to MovieBox structure
            // Simplified: look for raw matches in the string content first as backup
        }

        // 3. Fallback: Regex search in HTML body for videoUrl or playUrl
        // This is often more robust for simple scrapes
        const playUrlMatch = html.match(/"playUrl":"(.*?)"/);
        const videoUrlMatch = html.match(/"videoUrl":"(.*?)"/);

        let videoUrl = '';
        if (playUrlMatch) videoUrl = playUrlMatch[1];
        else if (videoUrlMatch) videoUrl = videoUrlMatch[1];

        // Clean up URL (unicode escapes)
        if (videoUrl) {
            videoUrl = JSON.parse(`"${videoUrl}"`); // Decode unicode
            return { url: videoUrl, quality: 'Auto', format: 'hls' };
        }

        return null;

    } catch (error) {
        console.error('❌ Error fetching moviebox video:', error);
        return null;
    }
}
