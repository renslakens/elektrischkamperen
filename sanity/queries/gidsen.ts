import { defineQuery } from 'next-sanity'

export const allGidsenQuery = defineQuery(`
  *[_type == "gids"] | order(gepubliceerd_op desc) {
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
  *[_type == "gids" && slug.current == $slug][0] {
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
  *[_type == "gids"]{ "slug": slug.current }
`)