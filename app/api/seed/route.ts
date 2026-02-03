
import { NextResponse } from 'next/server';
import prisma from '../../utils/db';

export const dynamic = 'force-dynamic';

// Base URL for TMDB images - w500 is more reliable than original
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// 30+ Popular movies with TMDB IDs and working poster URLs
const POPULAR_MOVIES = [
    // 2024 Blockbusters
    { id: "693134", title: "Dune: Part Two", overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen.", release: 2024, imageString: `${IMG_BASE}/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg`, category: "movie", age: 13, duration: 2.46 },
    { id: "940721", title: "Godzilla x Kong: The New Empire", overview: "Ancient titans Godzilla and Kong clash in an epic battle.", release: 2024, imageString: `${IMG_BASE}/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg`, category: "movie", age: 13, duration: 1.55 },
    { id: "533535", title: "Deadpool & Wolverine", overview: "Deadpool teams up with Wolverine for an adventure.", release: 2024, imageString: `${IMG_BASE}/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg`, category: "movie", age: 16, duration: 2.07 },
    { id: "573435", title: "Bad Boys: Ride or Die", overview: "Lowrey and Burnett try to clear their late captain's name.", release: 2024, imageString: `${IMG_BASE}/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg`, category: "movie", age: 16, duration: 1.55 },
    { id: "746036", title: "The Fall Guy", overview: "A stuntman must find the missing star of his ex's film.", release: 2024, imageString: `${IMG_BASE}/tSz1qsmSJon0rqjHBxXZmRotuse.jpg`, category: "movie", age: 13, duration: 2.06 },
    { id: "653346", title: "Kingdom of the Planet of the Apes", overview: "Apes are now the dominant species.", release: 2024, imageString: `${IMG_BASE}/gKkl37BQuKTanygYQG1pyYgLVgf.jpg`, category: "movie", age: 13, duration: 2.25 },
    { id: "1011985", title: "Kung Fu Panda 4", overview: "Po must train a new warrior.", release: 2024, imageString: `${IMG_BASE}/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg`, category: "movie", age: 7, duration: 1.34 },
    { id: "150540", title: "Inside Out 2", overview: "Riley's mind gets new emotions.", release: 2024, imageString: `${IMG_BASE}/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg`, category: "movie", age: 7, duration: 1.36 },
    { id: "1184918", title: "The Wild Robot", overview: "Robot Roz is stranded on an island.", release: 2024, imageString: `${IMG_BASE}/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg`, category: "movie", age: 7, duration: 1.42 },
    { id: "912649", title: "Venom: The Last Dance", overview: "Eddie and Venom on the run.", release: 2024, imageString: `${IMG_BASE}/k42Owka8v91Yw8keNPGaIwJJkXR.jpg`, category: "movie", age: 13, duration: 1.49 },

    // 2023-2024 Top Rated
    { id: "872585", title: "Oppenheimer", overview: "The story of J. Robert Oppenheimer.", release: 2023, imageString: `${IMG_BASE}/8Gxv8gSFCU0XGDykEGv7zR1kl3S.jpg`, category: "recent", age: 16, duration: 3.00 },
    { id: "823464", title: "Godzilla Minus One", overview: "Postwar Japan devastated by Godzilla.", release: 2023, imageString: `${IMG_BASE}/hkxxMIGaiCTmrEArK7J56JTKUlB.jpg`, category: "recent", age: 13, duration: 2.05 },
    { id: "762441", title: "A Quiet Place: Day One", overview: "The day the world went quiet.", release: 2024, imageString: `${IMG_BASE}/yrpPYKijwdMHyTGIOd1iK1h0Xno.jpg`, category: "recent", age: 13, duration: 1.40 },
    { id: "945961", title: "Alien: Romulus", overview: "Young colonizers face the ultimate terror.", release: 2024, imageString: `${IMG_BASE}/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg`, category: "recent", age: 16, duration: 1.59 },
    { id: "698687", title: "Transformers One", overview: "Origin of Optimus Prime and Megatron.", release: 2024, imageString: `${IMG_BASE}/iRLvMK9GjjJNjglPbs8sg0fuMiQ.jpg`, category: "recent", age: 10, duration: 1.44 },
    { id: "519182", title: "Despicable Me 4", overview: "Gru welcomes Gru Jr.", release: 2024, imageString: `${IMG_BASE}/wWba3TaojhK7NdycRhoQpsG0FaH.jpg`, category: "recent", age: 7, duration: 1.35 },
    { id: "1064028", title: "Subservience", overview: "AI robot becomes dangerous.", release: 2024, imageString: `${IMG_BASE}/gBEnbYBPHH6F1n5X3LKb4cRPNP6.jpg`, category: "recent", age: 16, duration: 1.48 },

    // Classics & Popular
    { id: "438631", title: "Dune", overview: "Paul Atreides must travel to the most dangerous planet.", release: 2021, imageString: `${IMG_BASE}/d5NXSklXo0qyIYkgV94XAgMIckC.jpg`, category: "show", age: 13, duration: 2.35 },
    { id: "299536", title: "Avengers: Infinity War", overview: "The Avengers face Thanos.", release: 2018, imageString: `${IMG_BASE}/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg`, category: "show", age: 13, duration: 2.29 },
    { id: "299534", title: "Avengers: Endgame", overview: "The Avengers assemble once more.", release: 2019, imageString: `${IMG_BASE}/or06FN3Dka5tukK1e9sl16pB3iy.jpg`, category: "show", age: 13, duration: 3.01 },
    { id: "634649", title: "Spider-Man: No Way Home", overview: "Peter's identity revealed.", release: 2021, imageString: `${IMG_BASE}/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg`, category: "show", age: 13, duration: 2.28 },
    { id: "505642", title: "Black Panther: Wakanda Forever", overview: "Wakanda honors their King.", release: 2022, imageString: `${IMG_BASE}/sv1xJUazXeYqALzczSZ3O6nkH75.jpg`, category: "show", age: 13, duration: 2.41 },
    { id: "447365", title: "Guardians of the Galaxy Vol. 3", overview: "Rocket's origin revealed.", release: 2023, imageString: `${IMG_BASE}/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg`, category: "show", age: 13, duration: 2.30 },
    { id: "603692", title: "John Wick: Chapter 4", overview: "John finds a way to defeat the High Table.", release: 2023, imageString: `${IMG_BASE}/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg`, category: "show", age: 16, duration: 2.49 },
    { id: "346698", title: "Barbie", overview: "Barbie and Ken leave Barbieland.", release: 2023, imageString: `${IMG_BASE}/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg`, category: "show", age: 13, duration: 1.54 },

    // Action & Thriller
    { id: "466420", title: "Killers of the Flower Moon", overview: "Serial murders of Osage people.", release: 2023, imageString: `${IMG_BASE}/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg`, category: "movie", age: 16, duration: 3.26 },
    { id: "76341", title: "Mad Max: Fury Road", overview: "Haunted Max helps Furiosa escape.", release: 2015, imageString: `${IMG_BASE}/8tZYtuWezp8JycMHi9W3RoNK9C8.jpg`, category: "movie", age: 16, duration: 2.00 },
    { id: "24428", title: "The Avengers", overview: "Nick Fury assembles a team.", release: 2012, imageString: `${IMG_BASE}/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg`, category: "movie", age: 13, duration: 2.23 },
    { id: "155", title: "The Dark Knight", overview: "Batman takes on The Joker.", release: 2008, imageString: `${IMG_BASE}/qJ2tW6WMUDux911r6m7haRef0WH.jpg`, category: "movie", age: 13, duration: 2.32 },
    { id: "27205", title: "Inception", overview: "A thief enters people's dreams.", release: 2010, imageString: `${IMG_BASE}/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg`, category: "movie", age: 13, duration: 2.28 },
];

export async function GET() {
    try {
        // Clear and seed database
        await prisma.watchList.deleteMany({});
        await prisma.movie.deleteMany({});

        let count = 0;
        for (const movie of POPULAR_MOVIES) {
            try {
                await prisma.movie.create({
                    data: {
                        ...movie,
                        videoSource: `https://vidsrc.xyz/embed/movie/${movie.id}`,
                        youtubeString: ''
                    }
                });
                count++;
            } catch (e: any) {
                console.error(`Failed to insert ${movie.title}:`, e.message);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Seeded ${count} popular movies with poster images!`,
            count: count,
            imageBase: IMG_BASE,
            sample: POPULAR_MOVIES.slice(0, 5).map(m => ({ id: m.id, title: m.title, image: m.imageString }))
        });

    } catch (error: any) {
        console.error('❌ Seed error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
