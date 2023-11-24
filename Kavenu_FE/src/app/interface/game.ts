export interface Game {
    polozka_id: number
    titul_polozky: string
    kratky_popis: string
    popis: string
    pujcovna_zaloha: number
    seo_url: string
    pujcovne_id: number
    pujcovne: number
    vek_hracu: string
    pocet_hracu: string
    delka_hry: string
    prehled_komponent: string
    odkaz_web_herni: string
    pujcenoOd?: string
    pujcenoDo?: string
}
