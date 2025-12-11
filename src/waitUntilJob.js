import { chat as aiChat } from "./ai";
import log from './log';

async function chat(contents, data)
{
    const aiReply  = await aiChat(contents);
    const followupUrl = `https://discord.com/api/v10/webhooks/${data.application_id}/${data.token}`;

    try {
        const response = await fetch(followupUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: aiReply
            }),
        });
    } catch(error) {
        log(error);
    }
}

export { chat }