import { FastifyPluginAsync, FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { RedisClientOptions, RedisClientType, createClient } from "redis";
import createPubsub from "./pubsub";
import createCache from "./cache";

const pubsubPlugin: FastifyPluginAsync<RedisClientOptions> = fp(async (fastify, opts) => {
    const redis = createClient(opts);
    await redis.connect();
    const pubsub = createPubsub(redis as RedisClientType);
    const cache = createCache(redis as RedisClientType);
    fastify.decorate("redis", { pubsub, cache });
})

export default pubsubPlugin;
