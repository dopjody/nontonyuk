
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Starting migration...");
        // Use local node_modules binary
        const { stdout, stderr } = await execPromise('./node_modules/.bin/prisma db push --accept-data-loss');
        console.log("Migration stdout:", stdout);
        console.log("Migration stderr:", stderr);
        return NextResponse.json({ success: true, stdout, stderr });
    } catch (error: any) {
        console.error("Migration error:", error);
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
