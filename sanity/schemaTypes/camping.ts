import { defineField, defineType } from 'sanity'
import { LANDEN, LAADSNELHEDEN } from '../../lib/camping-opties'

export default defineType({
    name: 'camping',
    title: 'Camping',
    type: 'document',
    groups: [
        { name: 'basis', title: 'Basisinfo' },
        { name: 'ev', title: '⚡ EV-laadinfo', default: true },
        { name: 'meta', title: 'Meta' },
    ],
    fields: [
        defineField({
            name: 'featured',
            title: 'Uitgelicht op homepage',
            type: 'boolean',
            initialValue: false,
            group: 'meta',
        }),

        // ── Import-data (komt later uit ACSI feed) ──
        defineField({
            name: 'naam', title: 'Naam', type: 'string',
            group: 'basis',
            validation: r => r.required(),
        }),
        defineField({
            name: 'slug', title: 'Slug', type: 'slug',
            group: 'basis',
            options: { source: 'naam' },
            validation: r => r.required(),
        }),
        defineField({
            name: 'locatie', title: 'Locatie', type: 'geopoint',
            group: 'basis',
        }),
        defineField({
            name: 'land', title: 'Land', type: 'string',
            group: 'basis',
            options: {
                list: [...LANDEN],
            },
        }),
        defineField({
            name: 'regio', title: 'Regio', type: 'string',
            group: 'basis',
            description: 'Bijv. Les Landes, Toscane, Tirol',
        }),
        defineField({
            name: 'affiliate_link', title: 'Affiliate link', type: 'url',
            group: 'basis',
        }),
        defineField({
            name: 'afbeeldingen', title: 'Afbeeldingen', type: 'array',
            group: 'basis',
            of: [{ type: 'image', options: { hotspot: true } }],
        }),

        // ── Handmatige EV-laadinfo (jouw USP) ──
        defineField({
            name: 'aantal_laders', title: 'Aantal laders', type: 'number',
            group: 'ev',
        }),
        defineField({
            name: 'laadsnelheid', title: 'Laadsnelheid', type: 'string',
            group: 'ev',
            description: 'Bijv. 11 kW, 22 kW, 50 kW',
            options: {
                list: [...LAADSNELHEDEN],
            },
        }),
        defineField({
            name: 'netwerk', title: 'Netwerk / Pas', type: 'string',
            group: 'ev',
            description: 'Bijv. Shell Recharge, eigen app, geen pas nodig',
        }),
        defineField({
            name: 'laden_bij_tent', title: 'Laden bij tent/caravan mogelijk?', type: 'boolean',
            group: 'ev',
            initialValue: false,
        }),
        defineField({
            name: 'snellader_in_buurt', title: 'Snellader in de buurt', type: 'string',
            group: 'ev',
            description: 'Bijv. Ionity op 12 km, Fastned op 8 km',
        }),
        defineField({
            name: 'ev_notitie', title: 'Extra notitie', type: 'text',
            group: 'ev',
            rows: 3,
            description: 'Alles wat niet in bovenstaande velden past',
        }),
        defineField({
            name: 'ev_geverifieerd_op', title: 'Geverifieerd op', type: 'date',
            group: 'meta',
            description: 'Wanneer heb je dit telefonisch of ter plaatse gecheckt?',
        }),
    ],

    preview: {
        select: {
            title: 'naam',
            subtitle: 'regio',
            media: 'afbeeldingen.0',
            laders: 'aantal_laders',
            kw: 'laadsnelheid',
        },
        prepare: ({ title, subtitle, media, laders, kw }) => ({
            title,
            subtitle: laders
                ? `⚡ ${laders}x ${kw ?? '?'} — ${subtitle ?? ''}`
                : `Geen laadinfo — ${subtitle ?? ''}`,
            media,
        }),
    },
})