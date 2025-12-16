import nacl from "tweetnacl";
import { handleCommand } from "./command/action";
import { setEnv } from "./workerEnv";

export default {
    async fetch(request, env, ctx) {
        setEnv(env);

        const signature = request.headers.get("X-Signature-Ed25519");
        const timestamp = request.headers.get("X-Signature-Timestamp");
        const body = await request.text();
        const publicKey = env.DISCORD_PUBLIC_KEY;
        
        // ---- signature verify ----
        const isValid = nacl.sign.detached.verify(
            new TextEncoder().encode(timestamp + body),
            hexToUint8Array(signature),
            hexToUint8Array(publicKey)
        );
      
        if (!isValid) {
            return new Response(
                JSON.stringify({ error: "Invalid request signature" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }
      
        // ---- PING ----
        const data = JSON.parse(body);
        if (data.type === 1) {
            return new Response('{"type":1}', {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": "9"
                }
            });
        }

        if (data.type === 2) {
            const command = data.data.name;
            const response = await handleCommand(ctx, command, data);
            return Response.json(response);
        }

        return new Response("OK");
    }
};

// ---- helper: hex → Uint8Array ----
function hexToUint8Array(hex) {
    return new Uint8Array(
        hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
}
