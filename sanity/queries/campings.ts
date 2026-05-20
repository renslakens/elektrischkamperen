import { defineQuery } from 'next-sanity'

export const allCampingsQuery = defineQuery(`
  *[_type == "camping"] | order(naam asc) {
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

export const campingBySlugQuery = defineQuery(`
  *[_type == "camping" && slug.current == $slug][0] {
    _id,
    naam,
    slug,
    locatie,
    land,
    regio,
    affiliate_link,
    afbeeldingen,
    aantal_laders,
    laadsnelheid,
    netwerk,
    laden_bij_tent,
    snellader_in_buurt,
    ev_notitie,
    ev_geverifieerd_op
    }
`)

export const allCampingSlugsQuery = defineQuery(`
  *[_type == "camping"]{ "slug": slug.current }
`)

// Gefilterd op land — voor regiopagina's
export const campingsByLandQuery = defineQuery(`
  *[_type == "camping" && land == $land] | order(naam asc) {
    _id,
    naam,
    slug,
    locatie,
    regio,
    affiliate_link,
    "thumbnail": afbeeldingen[0],
    aantal_laders,
    laadsnelheid,
    laden_bij_tent
    }
`)