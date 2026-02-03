
import axios from 'axios';
import * as cheerio from 'cheerio';

// Configuration for original MovieBox mirrors
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

/**
 * Original Scraper Logic from yutupremsatu/netflix
 */
export async function getMovieBoxVideo(subjectId: string): Promise<VideoSource | null> {
    console.log(`🎬 Fetching video for ID: ${subjectId} from ${HOST_URL}`);

    // Construct detail path
    const detailPath = `/detail?id=${subjectId}&scene&page_from=search_detail&type=%2Fmovie%2Fdetail`;

    try {
        // Fetch the HTML page
        const { data: html } = await client.get(detailPath);

        // 1. Try to extract from regex (most stable for these clones)
        const playUrlMatch = html.match(/"playUrl":"(.*?)"/);
        const videoUrlMatch = html.match(/"videoUrl":"(.*?)"/);

        let videoUrl = '';
        if (playUrlMatch) videoUrl = playUrlMatch[1];
        else if (videoUrlMatch) videoUrl = videoUrlMatch[1];

        // 2. Clean up URL (decode unicode escapes)
        if (videoUrl) {
            try {
                videoUrl = JSON.parse(`"${videoUrl}"`);
                return { url: videoUrl, quality: 'Auto', format: videoUrl.includes('.m3u8') ? 'hls' : 'mp4' };
            } catch (e) {
                console.error("URL Decode Error:", e);
            }
        }

        // 3. Fallback: Search for any .m3u8 in the body
        const m3u8Match = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/);
        if (m3u8Match) {
            return { url: m3u8Match[0], quality: 'Auto', format: 'hls' };
        }

        return null;

    } catch (error) {
        console.error('❌ Error fetching moviebox video:', error);
        return null;
    }
}
