import { RedisClientType } from "redis";
import EventBus from "./eventBus";

const createPubsub = (redis: RedisClientType) => {
    const pubsub = {
        publish: <TEvent extends IEvent>(topic: string, event: TEvent): Promise<number> => {
            const payload = JSON.stringify(event);
            console.log(`new message publishing at topic ${topic}`);
            return redis.publish(topic, payload);
        },
        subscribe: (topic: string, eventBus: IEventBus): Promise<void> => {

            console.log(`server listening on the topic ${topic}`);
            return redis.subscribe(topic, async (message) => {
                const payload = JSON.parse(message) as IEvent;
                console.log(payload);
                return eventBus.handle(payload);
            })
        }
    }

    return pubsub;
}

export default createPubsub;