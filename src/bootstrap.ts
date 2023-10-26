import googleMailPlugin from "@lib/mail/googleMailPlugin";
import Fastify from "fastify";
import { firebaseOptions, googleMailOptions, redisOptions } from "@config";
import redisPlugin from "@lib/redis/redisPlugin";
import firebasePlugin from "@lib/firebase/firebasePlugin";

const fastify = Fastify({ logger: true });

fastify.register(redisPlugin, { url: redisOptions.redisUrl });
fastify.register(googleMailPlugin, googleMailOptions);
fastify.register(firebasePlugin, firebaseOptions);

export default fastify;