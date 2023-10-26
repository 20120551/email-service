import { Interfaces } from "mailgun.js";
import { createGoogleMail } from "@lib/mail/googleMailPlugin";
import { Firebase } from "@lib/firebase/firebasePlugin";

declare module 'fastify' {
    interface FastifyInstance {
        redis: {
            cache: RedisCache,
            pubsub: RedisPubsub
        }
        mg: Interfaces.IMailgunClient,
        oAuthClient: ReturnType<typeof createGoogleMail>,
        firebase: Firebase
    }
}