import { chat as aiChat } from "./ai";
import log from './log';

async function chat(contents, data)
{
    const aiReply  = await aiChat(contents);
    const followupUrl = `https://discord.com/api/v10/webhooks/${data.application_id}/${data.token}`;

    const messages = splitMessage(aiReply, 2000);
    for (const msg of messages) {
        // 增加速率限制避免被當作 DDos
        await new Promise(r => setTimeout(r, 350));
        try {
            const response = await fetch(followupUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: msg
                }),
            });
        } catch(error) {
            log(error);
        }
    }
}

function splitMessage(text, limit = 2000) {
    const parts = text.split("\n");
    const result = [];

    let buffer = "";

    for (const part of parts) {
        // 如果單一段就超過 limit，強制硬切
        if (part.length > limit) {
            if (buffer) {
                result.push(buffer);
                buffer = "";
            }

            for (let i = 0; i < part.length; i += limit) {
                result.push(part.slice(i, i + limit));
            }
            continue;
        }

        const candidate = buffer
            ? buffer + "\n" + part
            : part;

        if (candidate.length > limit) {
            result.push(buffer);
            buffer = part;
        } else {
            buffer = candidate;
        }
    }

    if (buffer) {
        result.push(buffer);
    }

    return result;
}


export { chat }