
import { NextResponse } from 'next/server';
import prisma from '../../utils/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../utils/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || "";

    try {
        let whereClause = {};

        if (category === 'shows') {
            whereClause = { category: 'show' };
        } else if (category === 'movies') {
            whereClause = { category: 'movie' };
        } else if (category === 'recently') {
            whereClause = { category: 'recent' };
        }

        const movies = await prisma.movie.findMany({
            where: whereClause,
            select: {
                id: true,
                title: true,
                overview: true,
                imageString: true,
                videoSource: true,
                youtubeString: true,
                age: true,
                release: true,
                duration: true,
                WatchLists: {
                    where: { userId: userId },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, movies });
    } catch (error: any) {
        console.error('Error fetching movies:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
