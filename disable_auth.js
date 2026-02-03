
const projectId = "prj_BtwtyKoh4OY6VeKSrvUX3ccQlQw8";
const token = "MBYo81UziWFHzXNFOfTKxt27";

async function run() {
    try {
        console.log("Fetching project...");
        const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            console.error("Fetch failed:", res.status, await res.text());
            return;
        }

        const data = await res.json();
        console.log("Current ssoProtection:", JSON.stringify(data.ssoProtection, null, 2));

        // Disable it
        console.log("Disabling ssoProtection & passwordProtection...");
        const patchRes = await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ssoProtection: null,
                passwordProtection: null
            })
        });

        if (!patchRes.ok) {
            console.error("Patch failed:", patchRes.status, await patchRes.text());
            return;
        }

        const patchData = await patchRes.json();
        console.log("Updated ssoProtection:", JSON.stringify(patchData.ssoProtection, null, 2));
        console.log("SUCCESS: Vercel Auth Disabled.");

    } catch (e) {
        console.error("Error:", e);
    }
}

run();
