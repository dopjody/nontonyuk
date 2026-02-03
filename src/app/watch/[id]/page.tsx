'use client';

import { ArrowLeft, Play, Server, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Video embed sources configuration
const EMBED_SOURCES = [
    { name: 'VidSrc Pro', url: (id: string) => `https://vidsrc.pro/embed/movie/${id}` },
    { name: 'VidSrc ME', url: (id: string) => `https://vidsrc.me/embed/movie?tmdb=${id}` },
    { name: 'AutoEmbed', url: (id: string) => `https://player.autoembed.cc/embed/movie/${id}` },
    { name: 'SuperEmbed', url: (id: string) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1` },
    { name: 'VidSrc XYZ', url: (id: string) => `https://vidsrc.xyz/embed/movie/${id}` },
];

interface MovieData {
    id: string;
    title: string;
    description: string;
    cover: string;
    release_date: string;
    genre: string;
}

export default function Watch({ params }: { params: { id: string } }) {
    const { id } = params;
    const [movie, setMovie] = useState<MovieData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSource, setSelectedSource] = useState(0);
    const [showSourceSelector, setShowSourceSelector] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [iframeError, setIframeError] = useState(false);

    // Fetch movie data
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                // Try to fetch from Supabase via API
                const response = await fetch(`/api/movie/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setMovie(data);
                } else {
                    // Fallback: Create placeholder data
                    setMovie({
                        id,
                        title: `Movie ${id}`,
                        description: 'Loading movie information...',
                        cover: '/placeholder-movie.jpg',
                        release_date: '2024',
                        genre: 'Movie'
                    });
                }
            } catch (error) {
                console.error('Error fetching movie:', error);
                setMovie({
                    id,
                    title: `Movie ${id}`,
                    description: 'Movie information unavailable',
                    cover: '/placeholder-movie.jpg',
                    release_date: '2024',
                    genre: 'Movie'
                });
            }
            setLoading(false);
        };
        fetchMovie();
    }, [id]);

    // Handle iframe load events
    const handleIframeLoad = () => {
        setIframeLoaded(true);
        setIframeError(false);
    };

    // Try next source on error
    const tryNextSource = () => {
        if (selectedSource < EMBED_SOURCES.length - 1) {
            setSelectedSource(selectedSource + 1);
            setIframeLoaded(false);
            setIframeError(false);
        }
    };

    // Generate embed URL
    const embedUrl = EMBED_SOURCES[selectedSource].url(id);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#141414] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#141414] text-white flex flex-col">
            {/* Header */}
            <div className="absolute top-4 left-4 z-50 flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white bg-black/60 backdrop-blur px-4 py-2 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Link>

                {/* Source Selector */}
                <div className="relative">
                    <button
                        onClick={() => setShowSourceSelector(!showSourceSelector)}
                        className="flex items-center gap-2 text-white/70 hover:text-white bg-black/60 backdrop-blur px-4 py-2 rounded-lg transition"
                    >
                        <Server className="w-4 h-4" />
                        {EMBED_SOURCES[selectedSource].name}
                    </button>

                    {showSourceSelector && (
                        <div className="absolute top-12 left-0 bg-black/90 backdrop-blur rounded-lg overflow-hidden shadow-xl border border-white/10 min-w-[200px]">
                            {EMBED_SOURCES.map((source, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedSource(index);
                                        setShowSourceSelector(false);
                                        setIframeLoaded(false);
                                        setIframeError(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition flex items-center gap-3 ${selectedSource === index ? 'bg-red-600 text-white' : 'text-white/80'
                                        }`}
                                >
                                    <Server className="w-4 h-4" />
                                    {source.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Player Area */}
            <div className="w-full h-screen flex flex-col relative bg-black">
                {/* Loading Overlay */}
                {!iframeLoaded && !iframeError && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading {EMBED_SOURCES[selectedSource].name}...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {iframeError && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
                        <div className="text-center p-8">
                            <p className="text-red-500 text-xl mb-4">Server not responding</p>
                            <button
                                onClick={tryNextSource}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition mx-auto"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Next Server
                            </button>
                        </div>
                    </div>
                )}

                {/* Video Embed iframe */}
                <iframe
                    key={selectedSource}
                    src={embedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    onLoad={handleIframeLoad}
                    onError={() => setIframeError(true)}
                />
            </div>

            {/* Movie Info Section (Below Player) */}
            {movie && (
                <div className="p-6 md:p-12 max-w-5xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Poster */}
                        {movie.cover && (
                            <div className="flex-shrink-0">
                                <img
                                    src={movie.cover}
                                    alt={movie.title}
                                    className="w-48 rounded-lg shadow-xl"
                                />
                            </div>
                        )}

                        {/* Details */}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-6">
                                <span className="bg-white/10 px-3 py-1 rounded">{movie.release_date || '2024'}</span>
                                <span className="bg-green-600/20 text-green-500 px-3 py-1 rounded border border-green-600/50">HD</span>
                                {movie.genre && <span className="bg-white/10 px-3 py-1 rounded">{movie.genre}</span>}
                            </div>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {movie.description}
                            </p>
                        </div>
                    </div>

                    {/* Server Info */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-sm text-gray-500">
                            Currently streaming from: <span className="text-white">{EMBED_SOURCES[selectedSource].name}</span>
                            <span className="mx-2">•</span>
                            If playback doesn't work, try switching to a different server using the button above.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
