import ParseXmlEvent from "@events/parseXmlEvent";
import { parseXmlInvoiceDetail, storeBunchOfXmlData } from "@services/parserService";


export default class ParserXmlEventHandler implements IEventHandler<ParseXmlEvent> {
    event: string = ParseXmlEvent.name;
    async handle(event: ParseXmlEvent): Promise<void> {
        console.log(`handling ${event.name}`);
        const { email_id, url } = event;
        const {
            invoice,
            goods,
            buyer,
            seller,
            payment
        } = await parseXmlInvoiceDetail(url);

        const parser = {
            MLHDon: invoice,
            DSHHDVu: goods,
            NMua: buyer,
            NBan: seller,
            TToan: payment
        }

        await storeBunchOfXmlData(email_id, parser);
        console.log(`handled ${event.name}`);
    }

} 