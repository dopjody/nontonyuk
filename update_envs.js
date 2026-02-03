
const projectId = "prj_BtwtyKoh4OY6VeKSrvUX3ccQlQw8";
const token = "MBYo81UziWFHzXNFOfTKxt27";

const envs = [
    {
        key: "DATABASE_URL",
        value: "postgresql://postgres.riesqqctsavzpprucbal:%23uTzRMmmnED83Nc@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    },
    {
        key: "DIRECT_URL",
        value: "postgresql://postgres:%23uTzRMmmnED83Nc@db.riesqqctsavzpprucbal.supabase.co:5432/postgres"
    }
];

async function run() {
    for (const env of envs) {
        console.log(`Updating ${env.key}...`);

        // Find existing ID
        const listRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const listData = await listRes.json();
        const existing = listData.envs.find(e => e.key === env.key);

        if (existing) {
            console.log(`Deleting existing ${env.key}...`);
            await fetch(`https://api.vercel.com/v9/projects/${projectId}/env/${existing.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
        }

        // Add new
        console.log(`Adding ${env.key}...`);
        const addRes = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                key: env.key,
                value: env.value,
                type: "encrypted",
                target: ["production", "preview", "development"]
            })
        });

        if (!addRes.ok) {
            console.error(`Failed to add ${env.key}:`, await addRes.text());
        } else {
            console.log(`Successfully added ${env.key}.`);
        }
    }
}

run();
