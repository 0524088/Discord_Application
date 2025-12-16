// 註冊指令集
import "dotenv/config";
import { commands } from "./command/list.js";

const url_global  = `https://discord.com/api/v10/applications/${process.env.APPLICATION_ID}/commands`;
const url_test    = `https://discord.com/api/v10/applications/${process.env.APPLICATION_ID}/guilds/${process.env.GUILD_ID}/commands`;

const url = process.env.ENVIRONMENT === 'development' ? url_test : url_global;

try {
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${process.env.BOT_TOKEN}`
        },
        body: JSON.stringify(commands)
    });
    
    console.log(await res.json());
} catch(error) {
    console.log(error);
}
