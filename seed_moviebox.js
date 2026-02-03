
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

// Data path
const MOVIES_FILE = path.join(__dirname, '..', 'moviebox-api', 'data', 'movies.json');

async function seed() {
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log("📖 Reading MovieBox data...");
        if (!fs.existsSync(MOVIES_FILE)) {
            console.error("❌ Movies file not found at:", MOVIES_FILE);
            return;
        }

        const rawData = JSON.parse(fs.readFileSync(MOVIES_FILE, 'utf-8'));
        console.log(`✅ Loaded ${rawData.length} movies.`);

        await client.connect();
        console.log("🔗 Connected to database.");

        // We only seed a subset if it's too many, but let's try the first 50 for now
        const subset = rawData.slice(0, 50);

        for (const m of subset) {
            const sql = `
                INSERT INTO "Movie" (id, title, age, duration, overview, "imageString", release, "videoSource", category, "youtubeString", "createdAt")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
                ON CONFLICT (id) DO UPDATE SET
                  title = EXCLUDED.title,
                  overview = EXCLUDED.overview,
                  "imageString" = EXCLUDED."imageString",
                  release = EXCLUDED.release,
                  category = EXCLUDED.category
            `;

            // Transform data
            const values = [
                m.subjectId,
                m.title,
                12, // Default age
                Math.round(m.duration / 3600 * 100) / 100, // duration in hours
                m.description || m.title,
                m.cover?.url || m.cover || "",
                parseInt(m.releaseDate?.split('-')[0]) || 2024,
                `https://vidsrc.xyz/embed/movie/${m.subjectId}`, // Placeholder source
                "movie",
                "" // youtube placeholder
            ];

            await client.query(sql, values);
            console.log(`🚀 Seeded: ${m.title}`);
        }

        console.log("🎉 Seeding completed!");
        await client.end();
    } catch (err) {
        console.error("❌ Seeding error:", err);
    }
}

seed();
