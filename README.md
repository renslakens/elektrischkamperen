# ⚡ ElektrischKamperen.nl

Een niche platform voor EV-rijders die op kampeervakantie gaan in Europa. Het platform combineert een database van campings met geverifieerde laadpaalinformatie, interactieve reisroutes en uitgebreide reisgidsen.

---

## Tech stack

| Laag | Technologie |
|------|-------------|
| Framework | Next.js 15 (App Router) |
| CMS | Sanity v3 |
| Styling | Tailwind CSS v4 |
| Kaart | Leaflet / react-leaflet |
| Deploy | Vercel |
| Database | Supabase + PostGIS |

## Sanity document types

| Type | Doel | Data |
|------|------|------|
| `camping` | Campingpagina's
| `route` | Reisroutes met etappes
| `etappe` | Dag-etappes
| `gids` | Pillar pages met Portable Text
| `laadpaal` | Snelladers langs routes | OpenChargeMap sync |