let _env = null;

export function setEnv(env) {
    _env = env;
}

export function getEnv() {
    if (!_env) {
        throw new Error("Environment not initialized. Call setEnv(env) first.");
    }
    return _env;
}