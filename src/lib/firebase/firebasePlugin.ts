import { FastifyPluginCallback } from "fastify";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { FirebaseOptions, initializeApp } from "firebase/app";
import fp from "fastify-plugin";

export interface Firebase {
    storage: FirebaseStorage
}

const firebasePlugin: FastifyPluginCallback = fp((fastify, opts: FirebaseOptions, done) => {
    const app = initializeApp(opts);
    const db: FirebaseStorage = getStorage(app);
    fastify.decorate("firebase", { storage: db });
    done();
})

export default firebasePlugin;