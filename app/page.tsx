import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { featuredRoutesQuery, featuredCampingsQuery, latestGidsenQuery } from '@/sanity/queries/homepage'
import { maakMetadata } from '@/lib/metadata'
import { SearchBar } from '@/components/ui/SearchBar'
import { RouteCard } from '@/components/route/RouteCard'
import { CampingCard } from '@/components/camping/CampingCard'
import { GidsCard } from '@/components/gids/GidsCard'
import { vandaag } from '@/lib/utils'
import { websiteJsonLd, JsonLd } from '@/lib/structured-data'
import type {
  FeaturedRoutesQueryResult,
  FeaturedCampingsQueryResult,
  LatestGidsenQueryResult,
} from '@/sanity.types'

export const metadata = maakMetadata({
  titel: 'Elektrisch Kamperen — EV-campings & routes in Europa',
})

export default async function HomePage() {
  const [routes, campings, gidsen] = await Promise.all([
    sanityFetch<FeaturedRoutesQueryResult>({
      query: featuredRoutesQuery,
      tags: ['route'],
    }),
    sanityFetch<FeaturedCampingsQueryResult>({
      query: featuredCampingsQuery,
      tags: ['camping'],
    }),
    sanityFetch<LatestGidsenQueryResult>({
      query: latestGidsenQuery,
      params: { vandaag: vandaag() },
      tags: ['gids'],
    }),
  ])

  // Inhoudssecties wisselen wit en lichtgrijs af, ook als er een sectie ontbreekt (geen data).
  // De USP-balk krijgt een groene tint, zodat hij zich onderscheidt van de grijze footer.
  const zichtbareSecties = [
    routes.length > 0 && 'routes',
    gidsen.length > 0 && 'gidsen',
    campings.length > 0 && 'campings',
  ].filter(Boolean)
  const achtergrond = (sectie: 'routes' | 'gidsen' | 'campings') =>
    zichtbareSecties.indexOf(sectie) % 2 === 0 ? 'bg-white' : 'bg-gray-50'

  return (
    <>
      <JsonLd data={websiteJsonLd()} />

      {/* -mb-16 heft de mt-16 van de Footer op: de gekleurde USP-balk sluit direct aan op de footer */}
      <main className="-mb-16">

        {/* ── Hero ── */}
        <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-green-900 px-4 py-20 text-white">
          {/* Achtergrond */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-teal-900 opacity-90" />

          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              ⚡ Geverifieerde laadinfo bij elke camping
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              Elektrisch op vakantie,<br />zonder laadstress
            </h1>
            <p className="max-w-lg text-lg text-green-100">
              Vind campings met laadpaal, plan je route en rij zorgeloos door Europa.
            </p>
            <SearchBar />
            <div className="flex flex-wrap justify-center gap-x-4 text-sm text-green-200">
              <Link href="/campings" className="inline-block py-2.5 hover:text-white hover:underline">
                Alle campings →
              </Link>
              <Link href="/routes" className="inline-block py-2.5 hover:text-white hover:underline">
                Reisroutes →
              </Link>
              <Link href="/gidsen" className="inline-block py-2.5 hover:text-white hover:underline">
                Reisgidsen →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Uitgelichte routes ── */}
        {routes.length > 0 && (
          <section className={`${achtergrond('routes')} px-4 py-16`}>
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Populaire routes</h2>
                  <p className="mt-1 text-gray-500">
                    Uitgestippeld met laadstops en campings
                  </p>
                </div>
                <Link
                  href="/routes"
                  className="inline-block shrink-0 py-2 text-sm font-medium text-green-700 hover:underline"
                >
                  Alle routes →
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {routes.map((route) => (
                  <RouteCard key={route._id} route={route} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Nieuwste gidsen ── */}
        {gidsen.length > 0 && (
          <section className={`${achtergrond('gidsen')} px-4 py-16`}>
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Nieuwste reisgidsen</h2>
                  <p className="mt-1 text-gray-500">
                    Praktische tips voor elektrisch kamperen
                  </p>
                </div>
                <Link
                  href="/gidsen"
                  className="inline-block shrink-0 py-2 text-sm font-medium text-green-700 hover:underline"
                >
                  Alle gidsen →
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gidsen.map((gids) => (
                  <GidsCard key={gids._id} gids={gids} kop="h3" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Uitgelichte campings ── */}
        {campings.length > 0 && (
          <section className={`${achtergrond('campings')} px-4 py-16`}>
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Campings met laadpaal
                  </h2>
                  <p className="mt-1 text-gray-500">
                    Geverifieerde laadinfo, direct boeken
                  </p>
                </div>
                <Link
                  href="/campings"
                  className="inline-block shrink-0 py-2 text-sm font-medium text-green-700 hover:underline"
                >
                  Alle campings →
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {campings.map((camping) => (
                  <CampingCard key={camping._id} camping={camping} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── USP balk ── */}
        <section className="bg-green-50/60 px-4 py-14">
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
            {[
              {
                icon: '⚡',
                titel: 'Geverifieerde laadinfo',
                tekst: 'Wij bellen campings op en checken ter plaatse. Geen verouderde data.',
              },
              {
                icon: '🗺️',
                titel: 'Complete routes',
                tekst: 'Van vertrekpunt tot bestemming, met laadstops en overnachtingen.',
              },
              {
                icon: '🚐',
                titel: 'Ook voor caravans',
                tekst: 'We checken of de laadpaal naast je standplaats past.',
              },
            ].map((usp) => (
              <div key={usp.titel} className="text-center">
                <div className="mb-3 text-3xl">{usp.icon}</div>
                <h3 className="mb-2 font-semibold text-gray-900">{usp.titel}</h3>
                <p className="text-sm text-gray-500">{usp.tekst}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  )
}