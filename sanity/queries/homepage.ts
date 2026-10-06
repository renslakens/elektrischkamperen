import { defineQuery } from 'next-sanity'

// src/sanity/queries/homepage.ts
export const featuredRoutesQuery = defineQuery(`
  *[_type == "route" && featured == true] | order(_updatedAt desc) [0...3] {
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

// src/sanity/queries/homepage.ts
export const featuredCampingsQuery = defineQuery(`
  *[_type == "camping" && featured == true] | order(_updatedAt desc) [0...6] {
    _id,
    naam,
    slug,
    locatie,
    land,
    regio,
    affiliate_link,
    "thumbnail": afbeeldingen[0],
    aantal_laders,
    laadsnelheid,
    netwerk,
    laden_bij_tent,
    snellader_in_buurt,
    ev_geverifieerd_op
    }
`)

// Zelfde zichtbaarheidsfilter als in sanity/queries/gidsen.ts ($vandaag = vandaag() uit lib/utils)
export const latestGidsenQuery = defineQuery(`
  *[_type == "gids" && (!defined(gepubliceerd_op) || gepubliceerd_op <= $vandaag)]
    | order(coalesce(gepubliceerd_op, _createdAt) desc) [0...3] {
    _id,
    titel,
    slug,
    hook,
    hero_image,
    land,
    geschikt_voor,
    "aantal_campings": count(body[_type == "campingCard"])
    }
`)
