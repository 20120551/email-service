import base64url from "base64url";

export const base64Decoder = (input: string) => {
    // Replace non-url compatible chars with base64 standard chars
    input = input
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    let pad = input.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        input += new Array(5 - pad).join('=');
    }

    return input;
}

export const extractHeader = (headers: any) => {
    let from = null;
    let to = null;
    let subject = null;
    let date = null;

    for (const header of headers) {
        const { name, value } = header;
        if (name === "To") {
            to = value;
        } else if (name === "From") {
            const pattern = /<([^>]+)>/;

            const match = value.match(pattern);
            from = match[1];
        } else if (name === "Date") {
            date = new Date(value);
        } else if (name === "Subject") {
            subject = value;
        }

        if (from && to && subject && date) {
            break;
        }
    }

    return {
        from,
        to,
        subject,
        date
    }
}

export const extractBody = (parts: any) => {
    let content = null;
    let attachments: any[] = [];
    for (const part of parts) {
        const { body, filename } = part;
        let htmlPriority = false;
        let tempContent = null;
        // contain attachment
        if (part.parts) {
            part.parts.forEach((part: any) => {
                const { mimeType } = part;
                if (mimeType === "text/plain") {
                    // TODO: decode data
                    content = base64url.decode(part.body.data);
                }
                else if (mimeType === "text/html") {
                    htmlPriority = true;
                    tempContent = base64url.decode(part.body.data);
                }
            });

        } else {
            const { mimeType } = part;
            if (mimeType === "text/plain") {
                // TODO: decode data
                content = base64url.decode(part.body.data);
            }
            else if (mimeType === "text/html") {
                htmlPriority = true;
                tempContent = base64url.decode(part.body.data);
            }
        }

        if (filename) {
            attachments.push({
                id: body.attachmentId,
                filename
            })
        }

        if (htmlPriority) {
            content = tempContent;
        }
    }

    return {
        content,
        attachments
    }
}