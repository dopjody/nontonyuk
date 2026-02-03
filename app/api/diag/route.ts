
import { NextResponse } from 'next/server';
import prisma from '../../utils/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const count = await prisma.movie.count();
        const first = await prisma.movie.findFirst();

        const envStatus = {
            DATABASE_URL: !!process.env.DATABASE_URL,
            DIRECT_URL: !!process.env.DIRECT_URL,
        };

        return NextResponse.json({
            status: "ok",
            movieCount: count,
            firstMovie: first,
            env: envStatus,
            message: count === 0 ? "Database is empty!" : "Database has data."
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
