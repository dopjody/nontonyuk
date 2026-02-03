
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getMovieBoxVideo } from '@/lib/moviebox';

// Force dynamic rendering because we rely on search params/external data
export const dynamic = 'force-dynamic';

export default async function Watch({ params }: { params: { id: string } }) {
    const id = params.id;

    // 1. Fetch metadata from Supabase
    const { data: movie } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();

    if (!movie) {
        return (
            <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white gap-4">
                <h1>Content not found</h1>
                <Link href="/" className="text-red-600 hover:underline">Back to Home</Link>
            </div>
        );
    }

    // 2. Fetch video source from MovieBox
    const videoSource = await getMovieBoxVideo(id);

    return (
        <div className="min-h-screen bg-[#141414] text-white flex flex-col">
            {/* Back Button */}
            <div className="absolute top-4 left-4 z-50">
                <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white bg-black/50 px-4 py-2 rounded transition">
                    <ArrowLeft className="w-6 h-6" />
                    Back
                </Link>
            </div>

            {/* Main Player Area */}
            <div className="w-full h-screen flex flex-col relative bg-black">
                {videoSource ? (
                    <div className="w-full h-full flex items-center justify-center">
                        {/* Standard Video Player */}
                        {/* Note: Many HLS streams need hls.js for non-Safari browsers. 
                     For simplicity we use a basic video tag here. 
                     If the source is .m3u8, Chrome won't play it natively without HLS.js.
                     Usually MovieBox provides detailed .mp4 or .m3u8.
                  */}
                        <video
                            controls
                            autoPlay
                            className="w-full h-full max-h-screen object-contain"
                            poster={movie.cover}
                        >
                            <source src={videoSource.url} type="application/x-mpegURL" />
                            <source src={videoSource.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Overlay Debug Info (Removable) */}
                        <div className="absolute bottom-20 left-10 bg-black/50 p-2 text-xs text-gray-500 rounded">
                            Source: {videoSource.url.substring(0, 30)}...
                        </div>
                    </div>
                ) : (
                    // Fallback if no source found
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="absolute inset-0 opacity-20">
                            <img src={movie.cover} alt={movie.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="z-10 text-center p-8 bg-black/80 rounded-lg max-w-2xl">
                            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                            <p className="text-red-500 text-xl font-bold mb-4">Stream Not Available</p>
                            <p className="text-gray-400">
                                Could not extract a valid video URL from the source. <br />
                                This might be because the content is premium or the source is protected.
                            </p>
                            <button className="mt-8 bg-white text-black px-6 py-2 rounded hover:bg-gray-200 font-bold">
                                <Link href="/">Back to Browse</Link>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Details Section (Below fold) */}
            <div className="p-8 md:p-12 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
                <div className="flex gap-4 text-sm text-gray-400 mb-6">
                    <span>{movie.release_date || '2024'}</span>
                    <span className="border border-gray-600 px-1 rounded text-xs flex items-center">HD</span>
                    <span>{movie.genre}</span>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                    {movie.description}
                </p>
            </div>
        </div>
    );
}
