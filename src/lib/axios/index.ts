import { authOptions, googleMailOptions, hasuraOptions } from "@config";
import axios from "axios";

const googleApiClient = axios.create({
    baseURL: googleMailOptions.googleApiUrl,
})

const hasuraApiClient = axios.create({
    baseURL: hasuraOptions.hasuraApiUrl,
    headers: {
        "x-hasura-admin-secret": hasuraOptions.hasuraAdminSecret
    }
})

const authApiClient = axios.create({
    baseURL: authOptions.authApiUrl
})

export { googleApiClient, hasuraApiClient, authApiClient };