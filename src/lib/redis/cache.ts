import { RedisClientType } from "redis";

const createCache = (redis: RedisClientType) => {
    const cache = {
        set: async<T>(key: string, value: T, expirationTime: number) => {
            const payload = JSON.stringify(value);
            await redis.set(key, payload, {
                EX: expirationTime
            });
        },
        get: async<T>(key: string) => {
            const data = await redis.get(key);
            if (!data) {
                return null;
            }
            const payload = JSON.parse(data) as T;
            return payload;
        },
        del: async (key: string) => {
            const data = await redis.get(key);
            if (!data) {
                return false;
            }
            await redis.del(key);
            return true;
        }
    }

    return cache;
}

export default createCache;