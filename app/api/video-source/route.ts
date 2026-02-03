
import { NextResponse } from 'next/server';
import { getMovieBoxVideo } from '../../utils/moviebox';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    try {
        console.log(`🔍 [API] Fetching source for ID: ${id}`);
        const videoSource = await getMovieBoxVideo(id);
        console.log("🔍 [API] Scraping result:", videoSource ? "Found" : "Not Found", videoSource);

        if (!videoSource) {
            return NextResponse.json({ error: "No video source found" }, { status: 404 });
        }

        return NextResponse.json(videoSource);
    } catch (error: any) {
        console.error("❌ [API] Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
