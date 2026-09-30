import { maakMetadata } from '@/lib/metadata'
import { breadcrumbJsonLd, JsonLd } from '@/lib/structured-data'
import Link from 'next/link'

export const metadata = maakMetadata({
    titel: 'Over Elektrisch Kamperen — Wie zijn wij?',
    beschrijving: 'Wij helpen EV-rijders zorgeloos op kampeervakantie gaan in Europa. Alle laadinfo is handmatig geverifieerd — gebeld of ter plaatse gecheckt.',
    pad: '/over-ons',
})

export default function OverOnsPage() {
    return (
        <>
            <JsonLd data={breadcrumbJsonLd([
                { naam: 'Over ons', href: '/over-ons' },
            ])} />

            <main className="mx-auto max-w-2xl px-4 py-12">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Over ElektrischKamperen.nl
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Geverifieerde laadinfo bij elke camping — zodat jij zorgeloos op vakantie gaat.
                    </p>
                </div>

                <div className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-green-700">

                    <h2>Waarom ElektrischKamperen.nl?</h2>
                    <p>
                        Als EV-rijder wil je op vakantie gaan zonder je druk te maken over laden. Maar
                        bestaande platforms geven zelden betrouwbare laadinfo per camping. ACSI,
                        Camping.info en Booking.com geven hooguit aan dat een camping laadmogelijkheden
                        heeft — maar hoeveel laadpunten? Welk vermogen? Kun je je caravan er pal naast
                        zetten? Dat weet niemand.
                    </p>
                    <p>
                        Wij wél. Want wij bellen de campings op, of we controleren het ter plaatse.
                    </p>

                    <h2>Onze verificatiemethode</h2>
                    <p>
                        Elke camping op ons platform heeft geverifieerde EV-laadinfo. Dat betekent:
                    </p>
                    <ul>
                        <li>We bellen de camping op en stellen de juiste vragen</li>
                        <li>We noteren het aantal laadpunten, het vermogen en het netwerk</li>
                        <li>We checken of je caravan of camper naast de laadpaal past</li>
                        <li>We leggen vast wanneer de info is geverifieerd</li>
                    </ul>
                    <p>
                        Alle informatie is voorzien van een verificatiedatum, zodat jij weet hoe actueel
                        de data is.
                    </p>

                    <h2>Wat vind je op ons platform?</h2>
                    <ul>
                        <li>
                            <strong>Campings met laadpaal</strong> — per land, met geverifieerde laadinfo
                        </li>
                        <li>
                            <strong>Snellaadpunten in de buurt</strong> — via OpenChargeMap, live en actueel
                        </li>
                        <li>
                            <strong>EV-reisroutes</strong> — met laadstops en overnachtingen uitgestippeld
                        </li>
                        <li>
                            <strong>Reisgidsen</strong> — praktische tips voor elektrisch kamperen per land
                        </li>
                    </ul>

                    <h2>Contact</h2>
                    <p>
                        Heb je een vraag, wil je je camping aanmelden of heb je een fout gevonden in onze
                        laadinfo? Stuur een mail naar{' '}
                        <a href="mailto:info@elektrischkamperen.nl">info@elektrischkamperen.nl</a>.
                    </p>
                    <p>
                        Ben je campinghouder en wil je je laadinfo bijwerken of je camping op ons platform
                        vermelden?{' '}
                        <Link href="/campings/aanmelden">Meld je camping aan</Link> of neem contact op.
                    </p>
                </div>
            </main>
        </>
    )
}
