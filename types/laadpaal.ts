export type LaadpaalInBuurt = {
    id: number
    naam: string
    afstand_km: number | null
    netwerk: string
    max_kw: number | null
    connector_types: string[]
    aantal_punten: number | null
    lat: number | null
    lng: number | null
    is_snellader: boolean
}