import { serviceOptions } from "@config";
import { authApiClient } from "@lib/axios";
import { BadRequestError } from "@lib/error";

export const createCredential = async () => {
    // get accesstoken
    const res = await authApiClient.post("/v1/auth/login", {
        username: serviceOptions.serviceId,
        password: serviceOptions.serviceSecret
    });

    if (res.status >= 400) {
        throw new BadRequestError("something error when try calling to auth service");
    }

    return res.data;
}