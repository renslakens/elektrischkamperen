import { maakMetadata } from '@/lib/metadata'
import { breadcrumbJsonLd, JsonLd } from '@/lib/structured-data'
import { CampingSignupForm } from '@/components/camping/CampingSignupForm'

export const metadata = maakMetadata({
    titel: 'Camping aanmelden — laadpaal op je camping?',
    beschrijving: 'Heeft je camping laadpunten voor elektrische auto\'s? Meld je camping aan. Wij controleren de laadinfo en zetten de camping daarna op ElektrischKamperen.nl.',
    pad: '/campings/aanmelden',
})

export default function CampingAanmeldenPage() {
    return (
        <>
            <JsonLd data={breadcrumbJsonLd([
                { naam: 'Campings', href: '/campings' },
                { naam: 'Camping aanmelden', href: '/campings/aanmelden' },
            ])} />

            <main className="mx-auto max-w-2xl px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Camping aanmelden</h1>
                    <p className="mt-3 text-gray-600">
                        Heeft jouw camping laadpunten voor elektrische auto&apos;s? Vul het formulier in.
                        We controleren de laadinfo zelf, telefonisch of ter plaatse, voordat de camping op
                        de site verschijnt.
                    </p>
                </div>

                <CampingSignupForm />
            </main>
        </>
    )
}
