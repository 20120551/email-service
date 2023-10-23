import { Interfaces } from "mailgun.js";
import { RedisPubsub } from "redis";
import { createGoogleMail } from "@lib/mail/googleMailPlugin";

declare module 'fastify' {
    interface FastifyInstance {
        pubsub: RedisPubsub
        mg: Interfaces.IMailgunClient,
        oAuthClient: ReturnType<typeof createGoogleMail>
    }
}