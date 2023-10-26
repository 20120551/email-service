
import { Handler, schedule } from "@netlify/functions"
import fastify from "../bootstrap";
import { getBunchOfMessages, getBunchOfMessagesDetail, getMessageAttachments, publishMessages, storeBunchofMessages } from "@services/gmailPullerService";
const handler: Handler = schedule('*/15 * * * *', async () => {
    try {
        await fastify.ready();
        const { token } = await fastify.oAuthClient.getAccessToken();
        const messages = await getBunchOfMessages(token!, { maxResults: 10, labelIds: "INBOX" });

        if (messages.length === 0) {
            //TODO: handle
            return {
                statusCode: 400
            }
        }

        const messagesDetail = await getBunchOfMessagesDetail(token!, messages);
        if (messagesDetail.length === 0) {
            //TODO: handle
            return {
                statusCode: 400
            }
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

        return {
            statusCode: 200
        }
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500
        }
    }
})

export {
    handler
}