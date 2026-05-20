import { defineQuery } from 'next-sanity'

// Overzichtspagina /routes
export const allRoutesQuery = defineQuery(`
  *[_type == "route"] | order(totale_km asc) {
        _id,
        titel,
        slug,
        totale_km,
        caravan_geschikt,
        landen,
        thumbnail,
        seo_beschrijving,
        "aantalEtappes": count(etappes),
        "heeftLaadpaal": count(etappes[]->campings[]->[laadpaal_aanwezig == true]) > 0
    }
`)

// Detailpagina /routes/[slug]
export const routeBySlugQuery = defineQuery(`
  *[_type == "route" && slug.current == $slug][0] {
    _id,
    titel,
    slug,
    beschrijving,
    totale_km,
    caravan_geschikt,
    landen,
    thumbnail,
    seo_titel,
    seo_beschrijving,
    "etappes": etappes[]-> {
        _id,
        naam,
        slug,
        afstand_km,
        hoogteverschil_m,
        extra_verbruik_procent,
        rijdtips,
        polyline,
        "campings": campings[]-> {
            _id,
            naam,
            slug,
            locatie,
            "thumbnail": afbeeldingen[0],
            aantal_laders,
            laadsnelheid,
            netwerk,
            laden_bij_tent,
            snellader_in_buurt
        },
        "laadpalen": laadpalen[]-> {
            _id,
            naam,
            locatie,
            max_kw,
            netwerk,
            connector_types
        }
    }
}
`)

export const allRouteSlugsQuery = defineQuery(`
  *[_type == "route"]{ "slug": slug.current }
`)