import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { google } from "googleapis";


export const createGoogleMail = (opts: GoogleEmailOptions) => {
    const oAuth2Client = new google.auth.OAuth2(opts);
    oAuth2Client.setCredentials({ refresh_token: opts.refreshToken });
    return oAuth2Client;
}
const googleMailPlugin: FastifyPluginCallback<GoogleEmailOptions> = fp((fastify, opts: GoogleEmailOptions, done) => {
    const oAuth2Client = createGoogleMail(opts);
    console.log(oAuth2Client);
    fastify.decorate("oAuthClient", oAuth2Client);
    done();
})

export default googleMailPlugin;