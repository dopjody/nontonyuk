
const { Client } = require('pg');
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

console.log("Checking Movie count in original DB...");

async function checkCount() {
    try {
        await client.connect();
        const res = await client.query('SELECT COUNT(*) FROM "Movie"');
        console.log(`Count: ${res.rows[0].count}`);

        // Also fetch top 5 titles to see what kind of data
        const resTitles = await client.query('SELECT title FROM "Movie" LIMIT 5');
        console.log("Sample Data:", resTitles.rows.map(r => r.title));

        await client.end();
    } catch (err) {
        console.error("Error querying:", err.message);
        process.exit(1);
    }
}

checkCount();
