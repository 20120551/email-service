import { FirebaseOptions } from "firebase/app";
import { env } from "process";
import fs from "fs";
import path from "path";

export const googleMailOptions: GoogleEmailOptions = {
    type: env.TYPE!,
    user: env.USER!,
    refreshToken: env.REFRESH_TOKEN!,
    clientId: env.CLIENT_ID!,
    clientSecret: env.CLIENT_SECRET!,
    redirectUri: env.REDIRECT_URI!,
    googleApiUrl: env.GOOGLE_GMAIL_API!
}

export const firebaseOptions: FirebaseOptions = {
    apiKey: env.FIREBASE_APIKEY,
    authDomain: env.FIREBASE_AUTHDOMAIN,
    projectId: env.FIREBASE_PROJECTID,
    storageBucket: env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER,
    appId: env.FIREBASE_APP_ID,
    measurementId: env.FIREBASE_MENSUREMENT_ID
}

export const hasuraOptions = {
    hasuraApiUrl: env.HASURA_CLOUD_ENDPOINT,
    hasuraAdminSecret: env.HASURA_ADMIN_SECRET
}

export const authOptions = {
    authApiUrl: env.AUTH_ENDPOINT,
}

export const serviceOptions = {
    serviceId: env.SERVICE_ID,
    serviceSecret: env.SERVICE_SECRET
}

export const redisOptions = {
    redisUrl: env.REDIS_URL
}