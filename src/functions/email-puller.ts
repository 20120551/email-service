
import type { Config } from "@netlify/functions"
import fastify from "../bootstrap";
import axios from "axios";

export default async (req: Request) => {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/profile`;
    const { token } = await fastify.oAuthClient.getAccessToken();
    console.log("token", token);
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log("res ", response);
    const { next_run } = await req.json()
    console.log(next_run);
    console.log("Received event! Next invocation at:", next_run)

}

export const config: Config = {
    schedule: "* * * * *"
}