import { maakMetadata } from '@/lib/metadata'
import { breadcrumbJsonLd, JsonLd } from '@/lib/structured-data'

export const metadata = maakMetadata({
    titel: 'Privacybeleid — ElektrischKamperen.nl',
    beschrijving: 'Hoe ElektrischKamperen.nl omgaat met je persoonsgegevens.',
    pad: '/privacy',
})

export default function PrivacyPage() {
    return (
        <>
            <JsonLd data={breadcrumbJsonLd([
                { naam: 'Privacybeleid', href: '/privacy' },
            ])} />

            <main className="mx-auto max-w-2xl px-4 py-12">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Privacybeleid</h1>
                    <p className="mt-3 text-gray-500">
                        Hoe wij omgaan met je persoonsgegevens.
                    </p>
                </div>

                <div className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-green-700">

                    <p>
                        ElektrischKamperen.nl hecht veel waarde aan de bescherming van je
                        persoonsgegevens. In dit privacybeleid leggen we uit welke gegevens we
                        verzamelen, waarom en hoe we die gebruiken.
                    </p>

                    <h2>Verantwoordelijke</h2>
                    <p>
                        ElektrischKamperen.nl<br />
                        E-mail: <a href="mailto:info@elektrischkamperen.nl">info@elektrischkamperen.nl</a>
                    </p>

                    <h2>Welke gegevens verzamelen we?</h2>
                    <p>
                        We verzamelen alleen gegevens die nodig zijn voor het functioneren van de website:
                    </p>
                    <ul>
                        <li>
                            <strong>Analytische gegevens</strong> — bezoekersstatistieken
                            (paginaweergaven, herkomst, klikken op affiliate-links) via Google Analytics,
                            alleen nadat je daar toestemming voor hebt gegeven
                        </li>
                        <li>
                            <strong>Contactgegevens</strong> — alleen als je ons een e-mail stuurt of een
                            formulier invult (bijv. aanmelding camping)
                        </li>
                    </ul>

                    <h2>Cookies</h2>
                    <p>
                        ElektrischKamperen.nl gebruikt zonder toestemming geen analytische cookies en
                        geen advertentiecookies. Bij je eerste bezoek vragen we of we Google Analytics
                        (via Google Tag Manager) mogen gebruiken. Zeg je nee, dan worden er geen
                        analytische cookies geplaatst. We onthouden je keuze in je browser
                        (localStorage).
                    </p>
                    <p>
                        Heb je ja gezegd, dan plaatst Google Analytics cookies waarmee we zien hoe de
                        website wordt gebruikt. Je kunt je keuze op elk moment wijzigen via
                        &quot;Cookie-instellingen&quot; onderaan elke pagina. Google kan gegevens verwerken
                        buiten de EU; zie het privacybeleid van Google.
                    </p>
                    <p>
                        Affiliate links (naar Booking.com, Bol.com etc.) kunnen cookies plaatsen op de
                        externe websites die je bezoekt. Dit valt buiten ons beheer — raadpleeg het
                        privacybeleid van de betreffende website.
                    </p>

                    <h2>Delen met derden</h2>
                    <p>
                        We verkopen je gegevens nooit aan derden. We delen gegevens alleen als dat
                        wettelijk verplicht is.
                    </p>

                    <h2>Jouw rechten</h2>
                    <p>
                        Je hebt het recht om je gegevens in te zien, te corrigeren of te laten
                        verwijderen. Neem hiervoor contact op via{' '}
                        <a href="mailto:info@elektrischkamperen.nl">info@elektrischkamperen.nl</a>.
                    </p>

                    <h2>Wijzigingen</h2>
                    <p>
                        We kunnen dit privacybeleid aanpassen. De meest recente versie staat altijd op
                        deze pagina.
                    </p>

                    <p className="text-sm text-gray-400">
                        Laatste update: september 2026
                    </p>
                </div>
            </main>
        </>
    )
}
