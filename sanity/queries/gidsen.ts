import { defineQuery } from 'next-sanity'

// Zichtbaarheid: een gids is pas zichtbaar vanaf gepubliceerd_op (YYYY-MM-DD).
// $vandaag is de datum van vandaag in UTC (zie vandaag() in lib/utils.ts); een stringvergelijking
// van twee YYYY-MM-DD-datums is correct. Bewust geen now(): de Sanity API CDN cachet op URL en
// ververst alleen bij mutaties, dus een query met now() kan een uitkomst van gisteren teruggeven.
// Dit filter hoort in elke gids-query (ook sitemap en homepage).

export const allGidsenQuery = defineQuery(`
  *[_type == "gids" && (!defined(gepubliceerd_op) || gepubliceerd_op <= $vandaag)] | order(gepubliceerd_op desc) {
    _id,
    titel,
    slug,
    hook,
    hero_image,
    land,
    geschikt_voor,
    gepubliceerd_op,
    focus_keyword,
    // Tel het aantal camping cards in de body
    "aantal_campings": count(body[_type == "campingCard"])
    }
`)

export const gidsBySlugQuery = defineQuery(`
  *[_type == "gids" && slug.current == $slug && (!defined(gepubliceerd_op) || gepubliceerd_op <= $vandaag)][0] {
    _id,
    titel,
    slug,
    hook,
    hero_image,
    land,
    geschikt_voor,
    gepubliceerd_op,
    seo_titel,
    seo_beschrijving,
    focus_keyword,
    body[] {
        ...,
        // Resolve camping references in campingCard blokken
        _type == "campingCard" => {
            ...,
            camping-> {
            naam,
            slug,
            land,
            affiliate_link,
            afbeeldingen,
            aantal_laders,
            laadsnelheid,
            netwerk,
            laden_bij_tent,
            snellader_in_buurt
            }
        },
        // Resolve camping references in etappeBlokken
        _type == "etappeBlok" => {
                ...,
                campings[]-> {
                _id,
                naam,
                slug,
                "thumbnail": afbeeldingen[0],
                aantal_laders,
                laadsnelheid,
                netwerk,
                laden_bij_tent
                }
            }
        }
    }
`)

export const allGidsSlugsQuery = defineQuery(`
  *[_type == "gids" && defined(slug.current) && (!defined(gepubliceerd_op) || gepubliceerd_op <= $vandaag)]{ "slug": slug.current }
`)