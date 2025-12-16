import { chat, getLogs } from "../waitUntilJob";
import log from '../log';

async function handleCommand(ctx, command, data) {
    log(command);
    switch (command) {
        case "chat":
            ctx.waitUntil(chat(data));
            return getLoadingMessage();
        
        case "view log":
            ctx.waitUntil(getLogs(data));
            return getLoadingMessage();
    }
}

function getLoadingMessage()
{
    return {
        type: 5,
        data: {
            flags: 64
        }
    }
}

export {
    handleCommand
}