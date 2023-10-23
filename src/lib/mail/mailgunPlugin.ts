import { FastifyPluginCallback } from 'fastify';
import FormData from 'form-data';
import fp from "fastify-plugin";
import Mailgun, { MailgunClientOptions } from 'mailgun.js';

const mailgunPlugin: FastifyPluginCallback<MailgunClientOptions> = fp((fastify, opts: MailgunClientOptions, done) => {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client(opts);
    fastify.decorate("mg", mg);

    done();
})

export default mailgunPlugin;