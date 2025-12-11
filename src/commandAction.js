import { chat } from "./waitUntilJob";

async function handleCommand(ctx, command, data)
{
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