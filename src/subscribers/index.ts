import "module-alias/register";
import "dotenv/config";
import { XML_PARSER_CHANNEL } from "@events/constant";
import fastify from "../bootstrap";
import EventBus from "@lib/redis/eventBus";
import ParserXmlEventHandler from "./handlers/parserXmlHandler";

// bootstrap server here
const subscribe = async () => {
    try {
        await fastify.ready();
        const eventBus = new EventBus();
        const parserXmlEventHandler = new ParserXmlEventHandler();

        eventBus.register(parserXmlEventHandler.event, parserXmlEventHandler);
        await fastify.redis.pubsub.subscribe(XML_PARSER_CHANNEL, eventBus);
    } catch (err) {
        console.log(err);
    }
}

subscribe();