import { chat as aiChat } from "./ai";
import log from './log';
import { isAdmin } from "./db/adminRepo";

// 和 groq 聊天
async function chat(data) {
    const contents = data.data.options[0].value;
    const aiReply  = await aiChat(contents);
    const replyUrl = getReplyUrl(data);

    const messages = splitMessage(aiReply, 2000);
    for (const msg of messages) {
        // 增加速率限制避免被當作 DDos
        await new Promise(r => setTimeout(r, 350));
        try {
            const response = await fetch(replyUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: msg,
                    flags: 64
                }),
            });
        } catch(error) {
            log(error);
        }
    }
}

// 取得 log 列表
async function getLogs(data) {
    try {
        const discordId = data.member.user.id;

        // todo: 新增 log 至 KV
        let contents = "<No Permission>";
        if (await isAdmin(discordId)) {
            contents = "<log list>";
        }

        const replyUrl = getReplyUrl(data);
        const response = await fetch(replyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: contents,
                flags: 64
            }),
        });
    } catch(error) {
        log(error)
    }
}

function getReplyUrl(data) {
    return `https://discord.com/api/v10/webhooks/${data.application_id}/${data.token}`;
}

/**
 * 拆分訊息
 * 
 * 避免超過 discord 的單個回覆 2000 字的上限；且會依照 \n 去做貪婪拆分：
 * 多行累加未超過 2000 則可以一併回傳
 * 
 * @param {String} text 
 * @param {Integer} limit 
 * @returns 
 */
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

export {
    chat,
    getLogs
}