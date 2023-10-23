import googleMailPlugin from "@lib/mail/googleMailPlugin";
import Fastify from "fastify";
import { googleMailOptions } from "@config";

const fastify = Fastify({ logger: true });

fastify.register(googleMailPlugin, googleMailOptions);

export default fastify;