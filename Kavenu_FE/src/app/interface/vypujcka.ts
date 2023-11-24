export interface Vypujcka {
    vypujcka_id: number
    polozka_id: number
    objednava_osoba_id: number
    resi_osoba_id: number
    stav_id: number
    dat_zapujceni: string
    dat_navraceni: string
    dat_vraceno: string | null
    cena_zalohy: number
    cena_vypujcky: number
    nazevPolozky?: string
    stav?: string
    datZapujceni?: string
    datZapujceniJS: Date
    datNavraceni?: string
    datNavraceniJS: Date
    datVraceno?: string
    osoba?: string
    resitel?: string
}

export interface VypujckaBasicInfo {
    polozka_id: number
    dat_zapujceni: string
    dat_navraceni: string
}
