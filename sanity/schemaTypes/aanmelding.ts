import { defineField, defineType } from 'sanity'
import { LANDEN, LAADSNELHEDEN } from '../../lib/camping-opties'

// Aanmelding via /campings/aanmelden. Bevat contactgegevens en blijft daarom ALTIJD een draft:
// de dataset is publiek leesbaar, drafts niet. Publiceren en dupliceren staan uit in sanity.config.ts.
// De bijbehorende camping staat als los draft klaar (zonder contactgegevens), zie het veld `camping`.
export default defineType({
    name: 'aanmelding',
    title: 'Aanmelding',
    type: 'document',
    readOnly: true,
    fields: [
        defineField({
            name: 'camping', title: 'Camping (draft)', type: 'reference',
            to: [{ type: 'camping' }],
            weak: true,
            description: 'Het camping-draft dat bij deze aanmelding is aangemaakt. Controleer en verifieer de laadinfo voordat je het publiceert.',
        }),
        defineField({ name: 'campingnaam', title: 'Campingnaam', type: 'string' }),
        defineField({ name: 'plaats', title: 'Plaats', type: 'string' }),
        defineField({ name: 'land', title: 'Land', type: 'string', options: { list: [...LANDEN] } }),
        defineField({ name: 'aantal_laders', title: 'Aantal laders (opgegeven)', type: 'number' }),
        defineField({ name: 'vermogen', title: 'Vermogen (opgegeven)', type: 'string', options: { list: [...LAADSNELHEDEN] } }),
        defineField({ name: 'netwerk', title: 'Netwerk (opgegeven)', type: 'string' }),
        defineField({ name: 'contactpersoon', title: 'Contactpersoon', type: 'string' }),
        defineField({ name: 'email', title: 'E-mail', type: 'string' }),
        defineField({ name: 'opmerking', title: 'Opmerking', type: 'text', rows: 4 }),
        defineField({ name: 'akkoord_privacy', title: 'Akkoord met privacyverklaring', type: 'boolean' }),
        defineField({ name: 'ingediend_op', title: 'Ingediend op', type: 'datetime' }),
    ],
    preview: {
        select: { title: 'campingnaam', plaats: 'plaats', land: 'land', datum: 'ingediend_op' },
        prepare: ({ title, plaats, land, datum }) => ({
            title: title ?? 'Aanmelding',
            subtitle: [plaats, land, datum ? new Date(datum).toLocaleDateString('nl-NL') : null]
                .filter(Boolean)
                .join(' · '),
        }),
    },
})
