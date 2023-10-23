import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { RedisClientOptions, createClient } from "redis";
import EventBus from "./eventBus"

const pubsubPlugin: FastifyPluginCallback<RedisClientOptions> = fp((fastify, opts, done) => {
    const redis = createClient(opts);
    const pubsub = {
        publish: (topic: string, event: IEvent): Promise<number> => {
            const payload = JSON.stringify(event);
            return redis.publish(topic, payload);
        },
        subscribe: (topic: string): Promise<void> => {
            const eventBus = new EventBus();
            return redis.subscribe(topic, async (message) => {
                const payload = JSON.parse(message) as IEvent;
                return eventBus.handle(payload);
            })
        }
    }
    fastify.decorate("pubsub", pubsub);
    done();
})

export default pubsubPlugin;
