// Keuzelijsten van het camping-schema. Los bestand (zonder `sanity`-import) zodat
// ook het aanmeldformulier in de browser ze kan gebruiken.

export const LANDEN = [
    'Nederland', 'België', 'Duitsland', 'Frankrijk',
    'Italië', 'Spanje', 'Oostenrijk', 'Zwitserland', 'Kroatië',
] as const

export const LAADSNELHEDEN = [
    '3,7 kW (Schuko)', '11 kW (Type 2)', '22 kW (Type 2)', '50 kW (DC)', '150 kW+ (HPC)',
] as const
