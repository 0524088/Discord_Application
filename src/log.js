import { getEnv } from "./workerEnv";

export default async function log(message) {
    const key = `log:${Date.now()}`;
    await getEnv().KV.put(key, message);
}