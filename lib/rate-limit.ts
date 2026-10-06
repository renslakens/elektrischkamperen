// Eenvoudige rate limit per sleutel (bijv. IP) met een vast tijdvenster, in het geheugen.
// Let op: op Vercel heeft elke serverless-instantie zijn eigen geheugen. Dit remt misbruik
// vanaf één adres af, maar is geen harde garantie; daarvoor is een gedeelde store nodig.

type Venster = { aantal: number; startOp: number }

export function maakRateLimiter({ max, vensterMs }: { max: number; vensterMs: number }) {
    const vensters = new Map<string, Venster>()

    function ruimOp(nu: number) {
        for (const [sleutel, venster] of vensters) {
            if (nu - venster.startOp >= vensterMs) vensters.delete(sleutel)
        }
    }

    return function magDoor(sleutel: string, nu: number = Date.now()): boolean {
        if (vensters.size > 10_000) ruimOp(nu)

        const huidig = vensters.get(sleutel)
        if (!huidig || nu - huidig.startOp >= vensterMs) {
            vensters.set(sleutel, { aantal: 1, startOp: nu })
            return true
        }
        if (huidig.aantal >= max) return false

        vensters.set(sleutel, { aantal: huidig.aantal + 1, startOp: huidig.startOp })
        return true
    }
}
