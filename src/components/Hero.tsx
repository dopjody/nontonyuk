import { Play, Info } from 'lucide-react';

interface HeroProps {
    movie?: {
        title: string;
        description: string;
        cover: string;
    };
}

export default function Hero({ movie }: HeroProps) {
    // Fallback if no movie provided
    const title = movie?.title || 'Avatar: Fire and Ash';
    const description = movie?.description || 'Jake Sully and Neytiri have formed a family and are doing everything to stay together. However, they must leave their home and explore the regions of Pandora. When an ancient threat resurfaces, Jake must fight a difficult war against the humans.';
    const image = movie?.cover || 'https://pbcdnw.aoneroom.com/image/2026/01/27/830cb82db395dad0eab79d0148041071.jpg';

    return (
        <div className="relative h-[56.25vw] md:h-[80vh] w-full object-cover">
            <div className="absolute top-0 left-0 h-[80vh] w-full">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover brightness-[60%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent"></div>
            </div>

            <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-12 w-[90%] md:w-[40%] text-white z-10 transition-all">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black drop-shadow-xl mb-4">
                    {title}
                </h1>
                <p className="text-white text-sm md:text-lg drop-shadow-md mb-6 line-clamp-3">
                    {description}
                </p>

                <div className="flex flex-row gap-3 items-center">
                    <button className="bg-white text-black px-4 md:px-8 py-2 md:py-3 rounded flex flex-row items-center hover:bg-opacity-80 transition font-bold text-sm md:text-lg">
                        <Play className="w-4 h-4 md:w-6 md:h-6 mr-2 fill-black" />
                        Play
                    </button>
                    <button className="bg-gray-500/70 text-white px-4 md:px-8 py-2 md:py-3 rounded flex flex-row items-center hover:bg-gray-500/50 transition font-bold text-sm md:text-lg">
                        <Info className="w-4 h-4 md:w-6 md:h-6 mr-2" />
                        More Info
                    </button>
                </div>
            </div>
        </div>
    );
}
