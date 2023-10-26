export const parseBuyer = (rawBuyer: any) => {
    const { Ten, MST, HTTToan, SHDNNuoc, TNgay, DNgay, SHDong } = rawBuyer;
    return {
        Ten: Ten[0],
        MST: MST[0],
        HTTToan: HTTToan[0],
        SHDNNuoc: SHDNNuoc[0],
        TNgay: new Date(TNgay[0]),
        DNgay: new Date(DNgay[0]),
        SHDong: SHDong[0],
    }
}

export const parseSeller = (rawSeller: any) => {
    const { NBTen, NBMST, NBDChi, NBDThoai } = rawSeller;
    return {
        NBTen: NBTen[0],
        NBMST: NBMST[0],
        NBDChi: NBDChi[0],
        NBDThoai: NBDThoai[0],
    }
}

export const parseInvoice = (rawInvoice: any) => {
    const { MSHDon, KHHDon, SHDon, THDon, TDLap, DVTTe, TGia, IDHDon, TTCKhac } = rawInvoice;
    return {
        MSHDon: MSHDon[0],
        KHHDon: KHHDon[0],
        SHDon: SHDon[0],
        THDon: THDon[0],
        TDLap: new Date(TDLap[0]),
        DVTTe: DVTTe[0],
        TGia: parseInt(TGia[0]),
        IDHDon: IDHDon[0],
        TTCKhac: TTCKhac[0],
    }
}

export const parsePayment = (rawPayment: any) => {
    const { TgTCThue, TSGTGTang, TgTThue, TgTTTBSo, TgTTTBChu } = rawPayment;
    return {
        TgTCThue: parseFloat(TgTCThue[0]),
        TSGTGTang: parseInt(TSGTGTang[0]),
        TgTThue: parseFloat(TgTThue[0]),
        TgTTTBSo: parseFloat(TgTTTBSo[0]),
        TgTTTBChu: TgTTTBChu[0]
    }
}

export const parseGoodsService = (rawGoodsService: any) => {
    return rawGoodsService.HHDVu.map((HHDVu: any) => {
        const { STT, THHDVu, TTien, TSuat, TGTGTang, TCong } = HHDVu;
        return {
            Stt: parseInt(STT),
            TTien: parseFloat(TTien[0]),
            TSuat: parseInt(TSuat[0]),
            TGTGTang: parseFloat(TGTGTang[0]),
            TCong: parseFloat(TCong[0]),
            THHDVu: THHDVu[0]
        }
    })
}