
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
const MOVIES_FILE = path.join(__dirname, '..', 'moviebox-api', 'data', 'movies.json');

async function cleanAndSeed() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("🔗 Connected.");

        console.log("🧹 Wiping old movies...");
        await client.query(`DELETE FROM "WatchList"`);
        await client.query(`DELETE FROM "Movie"`);

        console.log("📖 Reading MovieBox data...");
        const rawData = JSON.parse(fs.readFileSync(MOVIES_FILE, 'utf-8'));
        const subset = rawData.slice(0, 40); // 40 movies is plenty

        for (const m of subset) {
            const sql = `
                INSERT INTO "Movie" (id, title, age, duration, overview, "imageString", release, "videoSource", category, "youtubeString", "createdAt")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            `;
            const values = [
                m.subjectId,
                m.title,
                12,
                Math.round(m.duration / 3600 * 100) / 100,
                m.description || m.title,
                m.cover?.url || m.cover || "",
                parseInt(m.releaseDate?.split('-')[0]) || 2024,
                `https://vidsrc.xyz/embed/movie/${m.subjectId}`,
                "movie",
                ""
            ];
            await client.query(sql, values);
            console.log(`🚀 Seeded: ${m.title}`);
        }

        console.log("✅ Done!");
        await client.end();
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

cleanAndSeed();
