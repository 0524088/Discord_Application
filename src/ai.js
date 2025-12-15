import { Groq } from "groq-sdk";
import { getEnv } from "./workerEnv";
import log from './log';

let ai = null;

function getAi() {
    if (!ai) {
        const env = getEnv();
        ai = new Groq({
            apiKey: env.GROQ_API_KEY
        });
    }
    return ai;
}

async function chat(contents) {
    try {
        const ai = getAi();
        const response = await ai.chat.completions.create({
            model: "groq/compound",
            messages: [
                { role: "user", content: contents }
            ]
        });
        const reply = response.choices[0].message.content;
        console.log("AI has replied");
        log(reply);
        return reply;
    } catch(error) {
        log(error);
    }
}

export {
    getAi,
    chat
}