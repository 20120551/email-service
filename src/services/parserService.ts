import { hasuraApiClient } from "@lib/axios"
import { BadRequestError } from "@lib/error"
import { createCredential } from "@utils/authHelper"
import { parseBuyer, parseGoodsService, parseInvoice, parsePayment, parseSeller } from "@utils/xmlInvoiceParserHelper";
import axios from "axios"
import xml from "xml2js";

const createPayment = async (token: string, payment: any) => {
    const mutation = `#graphql
        mutation MyMutation($objects: [thanhToan_insert_input!] = {}) {
            insert_thanhToan(objects: $objects) {
                returning {
                    id
                }
            }
        }
    `

    const res = await hasuraApiClient.post("/", {
        query: mutation,
        variables: {
            objects: payment
        }
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (res.data.errors) {
        console.log(res.data.errors);
        throw new BadRequestError("something wrong when try to create payment");
    }

    return res.data.data.insert_thanhToan.returning[0];
}

const createBuyer = async (token: string, buyer: any) => {
    const mutation = `#graphql
        mutation MyMutation($objects: [ngMua_insert_input!] = {}) {
            insert_ngMua(objects: $objects) {
                returning {
                    id
                }
            }
        }

    `

    const res = await hasuraApiClient.post("/", {
        query: mutation,
        variables: {
            objects: buyer
        }
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (res.data.errors) {
        console.log(res.data.errors);
        throw new BadRequestError("something wrong when try to create buyer");
    }

    return res.data.data.insert_ngMua.returning[0];
}

const createSeller = async (token: string, seller: any) => {
    const mutation = `#graphql
        mutation MyMutation($objects: [ngBan_insert_input!] = {}) {
            insert_ngBan(objects: $objects) {
                returning {
                    id
                }
            }
        }
    `

    const res = await hasuraApiClient.post("/", {
        query: mutation,
        variables: {
            objects: seller
        }
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (res.data.errors) {
        console.log(res.data.errors);
        throw new BadRequestError("something wrong when try to create seller");
    }

    return res.data.data.insert_ngBan.returning[0];
}

const createInvoice = async (token: string, invoice: any) => {
    const mutation = `#graphql
        mutation MyMutation($objects: [hoaDon_insert_input!] = {}) {
            insert_hoaDon(objects: $objects) {
                returning {
                    MSHDon
                    email_id
                }
            }
        }
    `

    const res = await hasuraApiClient.post("/", {
        query: mutation,
        variables: {
            objects: invoice
        }
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (res.data.errors) {
        console.log(res.data.errors);
        throw new BadRequestError("something wrong when try to create seller");
    }

    return res.data.data.insert_hoaDon.returning[0];
}

const createBunchOfGoodsService = async (token: string, invoiceId: string, goods: any[]) => {
    const mutation = `#graphql
        mutation MyMutation($objects: [dichVu_insert_input!] = {}) {
                insert_dichVu(objects: $objects) {
                    returning {
                        hoaDon_id
                        id
                    }
                }
            }
    `
    const res = await Promise.all(
        goods.map(async (good) => {
            const payload = {
                ...good,
                hoaDon_id: invoiceId
            }

            const res = await hasuraApiClient.post("/", {
                query: mutation,
                variables: {
                    objects: payload
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.errors) {
                console.log(res.data.errors);
                throw new BadRequestError("something wrong when try to create goods service");
            }

            return res.data.data.insert_dichVu.returning[0];
        })
    )

    return res;
}
export const parseXmlInvoiceDetail = async (url: string) => {
    const response = await axios.get(url);

    // create xml parse
    const parser = new xml.Parser();
    const jsonParser = await parser.parseStringPromise(response.data);

    // extract information
    const invoice = parseInvoice(jsonParser.HDon.DLHDon[0].TTChung[0]);
    const buyer = parseBuyer(jsonParser.HDon.DLHDon[0].NDHDon[0].NMua[0]);
    const seller = parseSeller(jsonParser.HDon.DLHDon[0].NDHDon[0].Nban[0]);
    const goods = parseGoodsService(jsonParser.HDon.DLHDon[0].NDHDon[0].DSHHDVu[0]);
    const payment = parsePayment(jsonParser.HDon.DLHDon[0].NDHDon[0].TToan[0]);

    return {
        invoice,
        buyer,
        seller,
        goods,
        payment
    }
}
export const storeBunchOfXmlData = async (emailId: string, xmlJsonFormat: any) => {
    const { MLHDon, NBan, NMua, DSHHDVu, TToan } = xmlJsonFormat;

    // get token
    const { token } = await createCredential();
    const { accesstoken } = token;

    // create buyer
    const buyer = await createBuyer(accesstoken, NMua);
    console.log("buyer: ", buyer);

    // create seller
    const seller = await createSeller(accesstoken, NBan);
    console.log("seller: ", seller);

    // create payment
    const payment = await createPayment(accesstoken, TToan);
    console.log("payment: ", payment);

    // create invoice
    const invoice = await createInvoice(accesstoken, {
        ...MLHDon,
        email_id: emailId,
        MSNBan_id: seller.id,
        MSNMua_id: buyer.id,
        TT_id: payment.id
    });
    console.log("invoice: ", invoice);

    // create goods service
    const goods = await createBunchOfGoodsService(accesstoken, invoice.MSHDon, DSHHDVu);
    console.log("goods: ", goods);
}
