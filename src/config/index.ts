import { env } from "process";

export const googleMailOptions: GoogleEmailOptions = {
    type: env.TYPE!,
    user: env.USER!,
    refreshToken: env.REFRESH_TOKEN!,
    clientId: env.CLIENT_ID!,
    clientSecret: env.CLIENT_SECRET!,
    redirectUri: env.REDIRECT_URI!,
    googleApiUrl: env.GOOGLE_GMAIL_API!
}