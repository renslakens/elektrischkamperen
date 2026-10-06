'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { LANDEN, LAADSNELHEDEN } from '@/lib/camping-opties'
import { valideerAanmelding, MAX_LENGTE, MAX_LADERS, type AanmeldingVeld, type Fouten } from '@/lib/aanmelding'

type Status = 'invullen' | 'versturen' | 'verstuurd'

const LEEG = {
    campingnaam: '',
    plaats: '',
    land: '',
    aantal_laders: '',
    vermogen: '',
    netwerk: '',
    contactpersoon: '',
    email: '',
    opmerking: '',
    akkoord_privacy: false,
    website: '', // honeypot
}

type Formulier = typeof LEEG

const invoerKlasse =
    'mt-1 block w-full rounded-lg border bg-white px-3 py-2.5 text-base text-gray-900 shadow-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30'

function Veld({
    id, label, verplicht, fout, hint, children,
}: {
    id: AanmeldingVeld
    label: string
    verplicht?: boolean
    fout?: string
    hint?: string
    children: React.ReactNode
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-800">
                {label}
                {verplicht ? <span className="text-red-600"> *</span> : <span className="font-normal text-gray-400"> (optioneel)</span>}
            </label>
            {children}
            {hint && !fout && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
            {fout && (
                <p id={`${id}-fout`} className="mt-1 text-sm text-red-600">
                    {fout}
                </p>
            )}
        </div>
    )
}

export function CampingSignupForm() {
    const [formulier, setFormulier] = useState<Formulier>(LEEG)
    const [fouten, setFouten] = useState<Fouten>({})
    const [algemeneFout, setAlgemeneFout] = useState<string | null>(null)
    const [status, setStatus] = useState<Status>('invullen')

    function wijzig<K extends keyof Formulier>(veld: K, waarde: Formulier[K]) {
        setFormulier((vorig) => ({ ...vorig, [veld]: waarde }))
        if (veld in fouten) {
            setFouten((vorig) => {
                const rest = { ...vorig }
                delete rest[veld as AanmeldingVeld]
                return rest
            })
        }
    }

    function foutProps(veld: AanmeldingVeld) {
        return {
            'aria-invalid': fouten[veld] ? true : undefined,
            'aria-describedby': fouten[veld] ? `${veld}-fout` : undefined,
            className: `${invoerKlasse} ${fouten[veld] ? 'border-red-500' : 'border-gray-300'}`,
        }
    }

    async function verstuur(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setAlgemeneFout(null)

        const controle = valideerAanmelding(formulier)
        if (!controle.geldig) {
            setFouten(controle.fouten)
            setAlgemeneFout('Controleer de gemarkeerde velden.')
            const eerste = Object.keys(controle.fouten)[0]
            if (eerste) document.getElementById(eerste)?.focus()
            return
        }

        setStatus('versturen')
        try {
            const res = await fetch('/api/camping-aanmelding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...controle.data, website: formulier.website }),
            })
            const body = (await res.json().catch(() => null)) as { success?: boolean; error?: string; fouten?: Fouten } | null

            if (res.ok && body?.success) {
                setStatus('verstuurd')
                setFormulier(LEEG)
                return
            }
            setFouten(body?.fouten ?? {})
            setAlgemeneFout(body?.error ?? 'Er ging iets mis bij het versturen. Probeer het later opnieuw.')
        } catch {
            setAlgemeneFout('Geen verbinding. Controleer je internet en probeer het opnieuw.')
        }
        setStatus('invullen')
    }

    if (status === 'verstuurd') {
        return (
            <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-6">
                <h2 className="text-lg font-semibold text-green-900">Bedankt voor je aanmelding!</h2>
                <p className="mt-2 text-sm text-green-800">
                    We hebben je gegevens ontvangen. We controleren de laadinfo zelf (telefonisch of ter
                    plaatse) voordat de camping op de site verschijnt. Daarover nemen we contact met je op.
                </p>
                <button
                    type="button"
                    onClick={() => setStatus('invullen')}
                    className="mt-4 min-h-11 text-sm font-medium text-green-700 hover:underline"
                >
                    Nog een camping aanmelden
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={verstuur} noValidate className="space-y-8">
            {algemeneFout && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {algemeneFout}
                </div>
            )}

            <fieldset className="space-y-5">
                <legend className="mb-2 text-lg font-semibold text-gray-900">De camping</legend>

                <Veld id="campingnaam" label="Naam van de camping" verplicht fout={fouten.campingnaam}>
                    <input
                        id="campingnaam" name="campingnaam" type="text" autoComplete="organization"
                        maxLength={MAX_LENGTE.campingnaam}
                        value={formulier.campingnaam}
                        onChange={(e) => wijzig('campingnaam', e.target.value)}
                        {...foutProps('campingnaam')}
                    />
                </Veld>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Veld id="plaats" label="Plaats" verplicht fout={fouten.plaats}>
                        <input
                            id="plaats" name="plaats" type="text" autoComplete="address-level2"
                            maxLength={MAX_LENGTE.plaats}
                            value={formulier.plaats}
                            onChange={(e) => wijzig('plaats', e.target.value)}
                            {...foutProps('plaats')}
                        />
                    </Veld>

                    <Veld id="land" label="Land" verplicht fout={fouten.land}>
                        <select
                            id="land" name="land"
                            value={formulier.land}
                            onChange={(e) => wijzig('land', e.target.value)}
                            {...foutProps('land')}
                        >
                            <option value="">Kies een land</option>
                            {LANDEN.map((land) => (
                                <option key={land} value={land}>{land}</option>
                            ))}
                        </select>
                    </Veld>
                </div>
            </fieldset>

            <fieldset className="space-y-5">
                <legend className="mb-2 text-lg font-semibold text-gray-900">Laadmogelijkheden</legend>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Veld id="aantal_laders" label="Aantal laadpunten" verplicht fout={fouten.aantal_laders}>
                        <input
                            id="aantal_laders" name="aantal_laders" type="number" inputMode="numeric"
                            min={1} max={MAX_LADERS} step={1}
                            value={formulier.aantal_laders}
                            onChange={(e) => wijzig('aantal_laders', e.target.value)}
                            {...foutProps('aantal_laders')}
                        />
                    </Veld>

                    <Veld id="vermogen" label="Vermogen per laadpunt" verplicht fout={fouten.vermogen}>
                        <select
                            id="vermogen" name="vermogen"
                            value={formulier.vermogen}
                            onChange={(e) => wijzig('vermogen', e.target.value)}
                            {...foutProps('vermogen')}
                        >
                            <option value="">Kies het vermogen</option>
                            {LAADSNELHEDEN.map((kw) => (
                                <option key={kw} value={kw}>{kw}</option>
                            ))}
                        </select>
                    </Veld>
                </div>

                <Veld
                    id="netwerk" label="Netwerk of laadpas" fout={fouten.netwerk}
                    hint="Bijvoorbeeld de naam van het laadnetwerk, een eigen app, of dat er geen pas nodig is."
                >
                    <input
                        id="netwerk" name="netwerk" type="text"
                        maxLength={MAX_LENGTE.netwerk}
                        value={formulier.netwerk}
                        onChange={(e) => wijzig('netwerk', e.target.value)}
                        {...foutProps('netwerk')}
                    />
                </Veld>
            </fieldset>

            <fieldset className="space-y-5">
                <legend className="mb-1 text-lg font-semibold text-gray-900">Contact</legend>
                <p className="text-sm text-gray-500">
                    Alleen voor ons, om de laadinfo te controleren. We tonen dit niet op de site.
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Veld id="contactpersoon" label="Contactpersoon" verplicht fout={fouten.contactpersoon}>
                        <input
                            id="contactpersoon" name="contactpersoon" type="text" autoComplete="name"
                            maxLength={MAX_LENGTE.contactpersoon}
                            value={formulier.contactpersoon}
                            onChange={(e) => wijzig('contactpersoon', e.target.value)}
                            {...foutProps('contactpersoon')}
                        />
                    </Veld>

                    <Veld id="email" label="E-mailadres" verplicht fout={fouten.email}>
                        <input
                            id="email" name="email" type="email" autoComplete="email" inputMode="email"
                            maxLength={MAX_LENGTE.email}
                            value={formulier.email}
                            onChange={(e) => wijzig('email', e.target.value)}
                            {...foutProps('email')}
                        />
                    </Veld>
                </div>

                <Veld id="opmerking" label="Opmerking" fout={fouten.opmerking}>
                    <textarea
                        id="opmerking" name="opmerking" rows={4}
                        maxLength={MAX_LENGTE.opmerking}
                        value={formulier.opmerking}
                        onChange={(e) => wijzig('opmerking', e.target.value)}
                        {...foutProps('opmerking')}
                    />
                </Veld>
            </fieldset>

            {/* Honeypot: onzichtbaar voor mensen, bots vullen het in */}
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                <label htmlFor="website">Website (niet invullen)</label>
                <input
                    id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={formulier.website}
                    onChange={(e) => wijzig('website', e.target.value)}
                />
            </div>

            <div>
                <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-gray-700">
                    <input
                        id="akkoord_privacy" name="akkoord_privacy" type="checkbox"
                        checked={formulier.akkoord_privacy}
                        onChange={(e) => wijzig('akkoord_privacy', e.target.checked)}
                        aria-invalid={fouten.akkoord_privacy ? true : undefined}
                        aria-describedby={fouten.akkoord_privacy ? 'akkoord_privacy-fout' : undefined}
                        className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 accent-green-700"
                    />
                    <span>
                        Ik ga akkoord met de{' '}
                        <Link href="/privacy" target="_blank" className="font-medium text-green-700 underline">
                            privacyverklaring
                        </Link>{' '}
                        en vind het goed dat jullie contact met me opnemen over deze aanmelding.
                        <span className="text-red-600"> *</span>
                    </span>
                </label>
                {fouten.akkoord_privacy && (
                    <p id="akkoord_privacy-fout" className="mt-1 text-sm text-red-600">
                        {fouten.akkoord_privacy}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={status === 'versturen'}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
                {status === 'versturen' ? 'Bezig met versturen…' : 'Aanmelding versturen'}
            </button>
        </form>
    )
}
