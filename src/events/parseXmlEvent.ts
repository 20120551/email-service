export default class ParseXmlEvent implements IEvent {
    name: string = "ParseXmlEvent";

    constructor(
        public id: string,
        public ten: string,
        public email_id: string,
        public url: string,
    ) {
    }
}