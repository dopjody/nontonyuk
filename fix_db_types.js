
const { Client } = require('pg');
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

async function fix() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("🔗 Connected.");

        // We need to drop the FK, change types, and restore it
        console.log("🛠️ Dropping constraints...");
        await client.query(`ALTER TABLE "WatchList" DROP CONSTRAINT IF EXISTS "WatchList_movieId_fkey"`);

        console.log("🛠️ Changing Movie ID to TEXT...");
        await client.query(`ALTER TABLE "Movie" ALTER COLUMN "id" TYPE TEXT`);

        console.log("🛠️ Changing WatchList movieId to TEXT...");
        await client.query(`ALTER TABLE "WatchList" ALTER COLUMN "movieId" TYPE TEXT`);

        console.log("🛠️ Restoring constraints...");
        await client.query(`ALTER TABLE "WatchList" ADD CONSTRAINT "WatchList_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE`);

        console.log("✅ Database types fixed!");
        await client.end();
    } catch (err) {
        console.error("❌ Fix error:", err);
    }
}

fix();
