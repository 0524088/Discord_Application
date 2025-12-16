import { getEnv } from "../workerEnv";

async function isAdmin(discrodId) {
    // return example: { "found": 1 }
    const exists = await getEnv().DB
        .prepare(`
            SELECT 1 AS found
            FROM admins
            WHERE discord_id = ?
            LIMIT 1
        `)
        .bind(discrodId)
        .first();

    return exists?.found === 1;
}

export {
    isAdmin
}