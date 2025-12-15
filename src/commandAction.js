import { chat } from "./waitUntilJob";
import log from './log';

async function handleCommand(ctx, command, data)
{
    log(command);
    switch (command) {
        case "ping":
            return {
                type: 4,
                data: { content: "Pong!" }
            };
        
        case "echo":
            const value = data.options[0].value;

            return {
                type: 4,
                data: { content: value }
            };
        
        case "chat":
            const contents = data.data.options[0].value;
            ctx.waitUntil(chat(contents, data));
            return { type: 5 };
    }
}

export {
    handleCommand
}