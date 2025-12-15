import { chat, getLogs } from "./waitUntilJob";
import log from './log';

async function handleCommand(ctx, command, data) {
    log(command);
    switch (command) {
        case "chat":
            ctx.waitUntil(chat(data));
            return { type: 5 };
        
        case "view_log":
            ctx.waitUntil(getLogs(data));
            return { type: 5 };
    }
}

export {
    handleCommand
}