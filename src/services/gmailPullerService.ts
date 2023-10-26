import { authApiClient, googleApiClient, hasuraApiClient } from "@lib/axios";
import { BadRequestError } from "@lib/error";
import fastify from "../bootstrap";
import { base64Decoder, extractBody, extractHeader } from "@utils/gmailMessageHelper";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import base64Url from "base64url";
import { serviceOptions } from "@config";
import { XML_PARSER_CHANNEL } from "@events/constant";
import ParseXmlEvent from "@events/parseXmlEvent";
import { createCredential } from "@utils/authHelper";

interface MessageFilter {
    labelIds: "INBOX" | "",
    maxResults: number,
}

export const getBunchOfMessages = async (
    token: string,
    { labelIds, maxResults }: MessageFilter) => {
    const response = await googleApiClient.get(`/me/messages?maxResults=${maxResults}&labelIds=${labelIds}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status >= 400) {
        throw new BadRequestError("something error");
    }

    const { messages } = response.data;
    return messages;
}

export const getBunchOfMessagesDetail = async (token: string, messages: any[]) => {
    const ids: any[] = []
    // get first message
    const firstMessageId = await fastify.redis.cache.get<string>("messageId") || "";
    for (const message of messages) {
        const { id } = message;
        // caching recent message id
        if (firstMessageId === id) {
            break;
        }

        ids.push(id);
    }

    // cache first element into redis
    if (ids.length !== 0) {
        await fastify.redis.cache.set<string>("messageId", ids[0], 10 * 60);
    }

    const batchMessages: any[] = await Promise.all(ids.map((id) => {
        const promise = googleApiClient.get(`/me/messages/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(({ data }) => {
            // TODO: handle filter fields needed
            const { payload } = data;
            const { headers, parts } = payload;
            const { from, to, subject, date } = extractHeader(headers);
            const { content, attachments } = extractBody(parts);
            // extract header
            return {
                id,
                from,
                to,
                subject,
                date,
                content,
                attachments
            };
        })

        return promise;
    }));

    return batchMessages;
}

export const getMessageAttachments = async (token: string, messageId: string, attachments: any[]) => {
    const batchAttachments = await Promise.all(
        attachments.map(({ filename, id }) => {
            const promise = googleApiClient.get(`/me/messages/${messageId}/attachments/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(({ data }) => {
                // TODO: handle attachment decoded

                const content = base64Url.toBuffer(data.data);
                return {
                    content,
                    filename,
                    id,
                }
            })

            return promise;
        })
    )

    return batchAttachments;
}

const getClientCredential = async (username: string) => {
    const query = `#graphql
        query MyQuery {
            user {
                id
            }
        }
    `

    const response = await hasuraApiClient.post("/", {
        query,
    }, {
        headers: {
            "x-hasura-role": "anonymous",
            "X-Hasura-Username": username
        }
    });



    const { user } = response.data.data;
    if (user.length === 0) {
        console.log(`${username} does not exist`);
        return {
            user: null
        }
    }
    console.log("get user hasura: ", response.data.data);

    return {
        user: user[0]
    };
}

const createEmail = async (token: string, payload: any) => {
    // create email
    const createEmail = `#graphql
            mutation MyMutation($objects: [email_insert_input!] = {}) {
                insert_email(objects: $objects) {
                    returning {
                        id  
                    }
                }
            }
        `

    const response = await hasuraApiClient.post("/", {
        query: createEmail,
        variables: {
            objects: payload
        }
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.data.errors) {
        throw new BadRequestError("something error when try to create a email");
    }

    console.log("email created: ", response.data.data.insert_email.returning);
    return response.data.data.insert_email.returning[0];
}

const createAttachment = async (token: string, emailId: string, attachments: any[]) => {
    const createAttachment = `#graphql
            mutation MyMutation($objects: [taiLieuDinhKem_insert_input!] = {}) {
                insert_taiLieuDinhKem(objects: $objects) {
                    returning {
                        id
                        ten
                        email_id
                        url
                    }
                }
            }
        `
    // store attachment
    const attachmentUrls = await Promise.all(
        attachments.map(async (attachment: any) => {
            const { filename, content } = attachment;
            const storageRef = ref(fastify.firebase.storage, `/files/${emailId}-${uuidv4()}-${filename}`);
            await uploadBytes(storageRef, content);
            const url = await getDownloadURL(storageRef);
            const attachmentPayload = {
                id: uuidv4(),
                email_id: emailId,
                ten: filename,
                url
            }

            const response = await hasuraApiClient.post("/", {
                query: createAttachment,
                variables: {
                    objects: attachmentPayload
                }
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status >= 400) {
                throw new BadRequestError("something error when try to create new attachment");
            }

            return response.data.data.insert_taiLieuDinhKem.returning[0];
        })
    );

    console.log("attachments: ", attachmentUrls);
    return attachmentUrls;
}
export const storeBunchofMessages = async (messages: any) => {
    //TODO: handle
    // get user information
    if (!messages) {
        throw new BadRequestError("no new message found");
    }
    const token = await createCredential();
    const { accesstoken } = token;

    const _messages = await Promise.all(messages.map(async (message: any) => {
        const { from, to, date, subject, content, attachments } = message;

        const { user } = await getClientCredential(from); // pass
        if (!user) {
            return []
        }
        console.log("client credential", user);

        const emailPayload = {
            id: uuidv4(),
            from,
            to,
            tieuDe: subject,
            noiDung: content,
            user_id: user.id
        }

        const { id } = await createEmail(accesstoken, emailPayload);
        const _attachments = await createAttachment(accesstoken, id, attachments);
        return _attachments;
    }))

    return _messages.flat();
}


export const publishMessages = async (messages: any[]) => {
    const xmlMessages = messages.filter((message) => message.ten.includes(".xml"));
    await Promise.all(
        xmlMessages.map((message) => {
            const { id, email_id, ten, url } = message;
            const event = new ParseXmlEvent(id, ten, email_id, url);
            return fastify.redis.pubsub.publish(XML_PARSER_CHANNEL, event);
        })
    )
}
