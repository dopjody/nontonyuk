'use client';

import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface MovieCardProps {
    data: any;
}

export default function MovieCard({ data }: MovieCardProps) {
    const image = data.cover?.url || data.cover || 'https://via.placeholder.com/300x450';

    return (
        <div className="group relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:z-50">
            <img
                src={image}
                className="rounded-sm object-cover md:rounded w-full h-full"
                alt={data.title}
            />

            {/* Hover Info Card */}
            <div className="absolute top-0 z-10 invisible h-full w-full scale-0 opacity-0 transition delay-300 duration-200 group-hover:scale-110 group-hover:-translate-y-[6vw] group-hover:translate-x-[2vw] group-hover:opacity-100 group-hover:visible sm:visible">
                <img
                    src={image}
                    className="cursor-pointer object-cover shadow-xl rounded-t-md w-full h-[140px]"
                    alt={data.title}
                />
                <div className="z-10 bg-[#181818] p-2 lg:p-4 absolute w-full shadow-lg rounded-b-md">
                    <div className="flex items-center gap-3">
                        <Link href={`/watch/${data.id}`} className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center hover:bg-neutral-300 transition">
                            <Play className="text-black w-3 h-3 lg:w-6 lg:h-6 fill-black" />
                        </Link>
                        <div className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 border-2 border-gray-400 rounded-full flex justify-center items-center hover:border-white text-white">
                            <Plus className="w-3 h-3 lg:w-6 lg:h-6" />
                        </div>
                        <div className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 border-2 border-gray-400 rounded-full flex justify-center items-center hover:border-white text-white">
                            <ThumbsUp className="w-3 h-3 lg:w-6 lg:h-6" />
                        </div>
                        <div className="cursor-pointer ml-auto w-6 h-6 lg:w-10 lg:h-10 border-2 border-gray-400 rounded-full flex justify-center items-center hover:border-white text-white max-lg:hidden">
                            <ChevronDown className="w-3 h-3 lg:w-6 lg:h-6" />
                        </div>
                    </div>

                    <div className="flex flex-row mt-4 gap-2 items-center">
                        <p className="text-green-400 font-semibold text-[10px] lg:text-sm">
                            98% Match
                        </p>
                        <p className="text-white text-[10px] lg:text-sm">{data.releaseDate?.split('-')[0] || '2025'}</p>
                        <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs font-semibold text-white">
                            HD
                        </div>
                    </div>

                    <div className="flex flex-row mt-4 gap-2 items-center">
                        <p className="text-white text-[10px] lg:text-sm font-bold">{data.title}</p>
                    </div>

                    <div className="flex flex-row items-center gap-2 mt-2 text-[8px] lg:text-xs text-white">
                        {data.genre?.split(',').slice(0, 3).map((g: string) => (
                            <span key={g} className="mr-1 text-gray-400">
                                {g} •
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
