'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Watch({ params }: { params: { id: string } }) {
    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Unwrap params (in Next.js 15+ this might need to be awaited, but for 14 it's direct or async component)
    // To be safe with recent versions:
    const id = params.id;

    useEffect(() => {
        const fetchMovie = async () => {
            const { data } = await supabase
                .from('content')
                .select('*')
                .eq('id', id)
                .single();

            setMovie(data);
            setLoading(false);
        };

        if (id) fetchMovie();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white gap-4">
                <h1>Movie not found</h1>
                <Link href="/" className="text-red-600 hover:underline">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#141414] text-white">
            {/* Back Button */}
            <Link href="/" className="absolute top-4 left-4 z-50 flex items-center gap-2 text-white/70 hover:text-white bg-black/50 px-4 py-2 rounded">
                <ArrowLeft className="w-6 h-6" />
                Back
            </Link>

            {/* Video Player Placeholder */}
            <div className="w-full h-screen flex flex-col items-center justify-center bg-black relative">
                <div className="absolute inset-0 opacity-20">
                    <img src={movie.cover} alt={movie.title} className="w-full h-full object-cover" />
                </div>

                <div className="z-10 text-center p-8 bg-black/80 rounded-lg max-w-2xl">
                    <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                    <p className="text-gray-400 mb-8">{movie.description}</p>

                    <div className="w-full aspect-video bg-gray-900 rounded border border-gray-700 flex items-center justify-center">
                        <p className="text-gray-400">
                            Video Stream functionality is currently under development.
                            <br />
                            (Requires specialized streaming backend)
                        </p>
                    </div>

                    <div className="mt-8 flex gap-4 justify-center">
                        <button className="bg-red-600 px-6 py-2 rounded hover:bg-red-700 font-bold">
                            Retry Playback
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
