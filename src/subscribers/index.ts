import fastify from "../bootstrap";

// bootstrap server here
const subscribe = async () => {
    await fastify.ready();
    await fastify.pubsub.subscribe("topic");
}

subscribe();
// export default subscribe;