import { maakMetadata } from '@/lib/metadata'
import { breadcrumbJsonLd, JsonLd } from '@/lib/structured-data'

export const metadata = maakMetadata({
    titel: 'Affiliate disclaimer — ElektrischKamperen.nl',
    beschrijving: 'ElektrischKamperen.nl gebruikt affiliate links. Lees hier hoe dat werkt en wat dat voor jou betekent.',
    pad: '/affiliate-disclaimer',
})

export default function AffiliateDsclaimerPage() {
    return (
        <>
            <JsonLd data={breadcrumbJsonLd([
                { naam: 'Affiliate disclaimer', href: '/affiliate-disclaimer' },
            ])} />

            <main className="mx-auto max-w-2xl px-4 py-12">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Affiliate disclaimer</h1>
                    <p className="mt-3 text-gray-500">
                        Hoe wij onze site financieren — transparant en eerlijk.
                    </p>
                </div>

                <div className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-green-700">

                    <h2>Wat zijn affiliate links?</h2>
                    <p>
                        Op ElektrischKamperen.nl gebruiken we affiliate links. Dat zijn speciale links
                        naar externe websites — zoals Booking.com, ANWB Kamperen, Bol.com en Amazon —
                        waarbij wij een kleine commissie ontvangen als jij via onze link iets boekt of
                        koopt. Voor jou verandert er niets: je betaalt exact hetzelfde als wanneer je
                        direct naar de website zou gaan.
                    </p>

                    <h2>Welke affiliate programma&apos;s gebruiken we?</h2>
                    <ul>
                        <li>
                            <strong>Booking.com</strong> — voor campingboekingen via het Booking.com
                            affiliate programma
                        </li>
                        <li>
                            <strong>ANWB Kamperen</strong> — voor campingboekingen via het Tradedoubler
                            netwerk
                        </li>
                        <li>
                            <strong>Bol.com</strong> — voor producten zoals laadpassen, adapters en
                            laadkabels
                        </li>
                        <li>
                            <strong>Amazon</strong> — voor EV-accessoires die niet via Bol.com
                            beschikbaar zijn
                        </li>
                    </ul>

                    <h2>Onze redactionele onafhankelijkheid</h2>
                    <p>
                        Affiliate links hebben <strong>geen invloed op onze aanbevelingen</strong>. Een
                        camping staat op ons platform omdat de laadinfo geverifieerd is — niet omdat we
                        er commissie op verdienen. We vermelden campings zonder affiliate link net zo
                        goed als campings mét.
                    </p>
                    <p>
                        In reisgidsen linken we naar producten die we daadwerkelijk nuttig vinden voor
                        de elektrische kampeerder. Gesponsorde vermeldingen worden altijd als zodanig
                        gelabeld.
                    </p>

                    <h2>Herkenning van affiliate links</h2>
                    <p>
                        Affiliate links zijn herkenbaar aan de tekst &quot;Je verlaat de site via een
                        affiliate link&quot; of het label &quot;gesponsord&quot; in de buurt van de link.
                        In de HTML-code bevatten affiliate links het attribuut{' '}
                        <code>rel=&quot;sponsored&quot;</code>, conform de Google-richtlijnen.
                    </p>

                    <h2>Vragen?</h2>
                    <p>
                        Heb je vragen over ons gebruik van affiliate links? Neem contact op via{' '}
                        <a href="mailto:info@elektrischkamperen.nl">info@elektrischkamperen.nl</a>.
                    </p>

                    <p className="text-sm text-gray-400">
                        Laatste update: september 2026
                    </p>
                </div>
            </main>
        </>
    )
}
