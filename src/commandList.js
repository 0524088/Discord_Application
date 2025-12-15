// 指令列表
export const commands = [
    // {
    //     name: "ping",
    //     description: "Replies with Pong!"
    // },
    // {
    //     name: "echo",
    //     description: "Replies what you type",
    //     options: [
    //         {
    //             name: "text",
    //             description: "Text to echo",
    //             type: 3, // STRING
    //             required: true
    //         }
    //     ]
    // },
    {
        name: "chat",
        description: "chat with ai",
        options: [
            {
                name: "contents",
                description: "contents to chat",
                type: 3,
                required: true 
            }
        ]
    },
    {
        name: "view_log",
        description: "check current log list",
        default_member_permissions: 8,
    }
];