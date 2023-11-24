export interface User {
    osoba_id: number
    jmeno: string
    prijmeni: string
    prezdivka: string
    telefon: number
    email: string
    heslo: string
    role_id: number
    role?: string
}
