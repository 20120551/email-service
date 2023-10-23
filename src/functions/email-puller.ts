
import { Handler, schedule } from "@netlify/functions"
import fastify from "../bootstrap";
import axios from "axios";

const handler: Handler = schedule('* * * * *', async () => {
    await fastify.ready();
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/profile`;
    const { token } = await fastify.oAuthClient.getAccessToken();
    console.log("token", token);
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log("res ", response);
    return {
        statusCode: 200
    }
})

export {
    handler
}