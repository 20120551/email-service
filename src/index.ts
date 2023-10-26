import "module-alias/register";
import 'dotenv/config';
import fastify from "./bootstrap";
import { getBunchOfMessages, getBunchOfMessagesDetail, getMessageAttachments, publishMessages, storeBunchofMessages } from "@services/gmailPullerService";

fastify.get("/", async (req, reply) => {
    const { token } = await fastify.oAuthClient.getAccessToken();
    const messages = await getBunchOfMessages(token!, { maxResults: 5, labelIds: "INBOX" });

    if (messages.length === 0) {
        //TODO: handle
    }

    const messagesDetail = await getBunchOfMessagesDetail(token!, messages);
    if (messagesDetail.length === 0) {
        //TODO: handle
    }

    // get attachments
    const cleanMessage = await Promise.all(
        messagesDetail.map(message => {
            const { id, attachments } = message;

            const promise = getMessageAttachments(token!, id, attachments)
                .then(attachments => {
                    return {
                        ...message,
                        attachments
                    }
                });
            return promise;
        })
    )

    const _messages = await storeBunchofMessages(cleanMessage);

    // filter pubsub message
    await publishMessages(_messages);

    reply.send(_messages);
})
const bootstrap = async () => {
    await fastify.listen({ port: 3000 });
    console.log("fastify is listen in port 3000");
}

bootstrap();