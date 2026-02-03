
const { Client } = require('pg');
const connectionString = "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

console.log("Testing connection to original repo DB...");

client.connect()
    .then(() => {
        console.log("SUCCESS: Connected to original DB!");
        return client.end();
    })
    .catch((err) => {
        console.error("FAILURE: Could not connect.", err.message);
        process.exit(1);
    });
