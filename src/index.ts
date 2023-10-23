import "module-alias/register";
import fastify from "./bootstrap";
import axios from "axios";


fastify.get("/", async (req, reply) => {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/profile`;
    const { token } = await fastify.oAuthClient.getAccessToken();
    console.log("token", token);
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    reply.send(response.data);
})
const bootstrap = async () => {
    await fastify.listen({ port: 3000 });
    console.log("fastify is listen in port 3000");
}

bootstrap();