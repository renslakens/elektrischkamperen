import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
    name: 'gids',
    title: 'Gids',
    type: 'document',
    groups: [
        { name: 'inhoud', title: 'Inhoud', default: true },
        { name: 'seo', title: 'SEO' },
        { name: 'meta', title: 'Meta' },
    ],
    fields: [

        // ── Hoofdvelden ──
        defineField({
            name: 'titel', title: 'Titel', type: 'string',
            group: 'inhoud',
            validation: r => r.required(),
        }),
        defineField({
            name: 'slug', title: 'Slug', type: 'slug',
            group: 'inhoud',
            options: { source: 'titel' },
            validation: r => r.required(),
        }),
        defineField({
            name: 'hook', title: 'Hook (intro)', type: 'text',
            group: 'inhoud',
            rows: 3,
            description: 'De openingszin die de pijn beschrijft. Bijv: Met een caravan naar het zuiden? Wij selecteerden 15 campings waar je wél zorgeloos laadt.',
        }),
        defineField({
            name: 'hero_image', title: 'Hero afbeelding', type: 'image',
            group: 'inhoud',
            options: { hotspot: true },
        }),

        // ── Portable Text body met custom blocks ──
        defineField({
            name: 'body', title: 'Inhoud', type: 'array',
            group: 'inhoud',
            of: [
                // Standaard tekst
                defineArrayMember({
                    type: 'block',
                    styles: [
                        { title: 'Normaal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                    lists: [
                        { title: 'Opsomming', value: 'bullet' },
                        { title: 'Genummerd', value: 'number' },
                    ],
                    marks: {
                        decorators: [
                            { title: 'Vet', value: 'strong' },
                            { title: 'Cursief', value: 'em' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'Link',
                                fields: [
                                    defineField({ name: 'href', type: 'url', title: 'URL' }),
                                    defineField({ name: 'affiliate', type: 'boolean', title: 'Affiliate link?', initialValue: false }),
                                ],
                            },
                        ],
                    },
                }),

                // Custom block: Camping Card
                defineArrayMember({
                    type: 'object',
                    name: 'campingCard',
                    title: 'Camping card',
                    fields: [
                        defineField({
                            name: 'camping', title: 'Camping', type: 'reference',
                            to: [{ type: 'camping' }],
                            validation: r => r.required(),
                        }),
                        defineField({
                            name: 'redactionele_review', title: 'Waarom staat deze camping in de gids?',
                            type: 'text', rows: 3,
                            description: 'Jouw persoonlijke toelichting — dit is wat de bezoeker overtuigt',
                        }),
                        defineField({
                            name: 'cta_tekst', title: 'CTA knoptekst', type: 'string',
                            initialValue: 'Check prijzen & beschikbaarheid',
                        }),
                    ],
                    preview: {
                        select: { title: 'camping.naam', subtitle: 'redactionele_review' },
                        prepare: ({ title, subtitle }) => ({
                            title: `Camping card: ${title ?? 'niet gekoppeld'}`,
                            subtitle,
                        }),
                    },
                }),

                // Custom block: Etappe
                defineArrayMember({
                    type: 'object',
                    name: 'etappeBlok',
                    title: 'Etappe',
                    fields: [
                        defineField({
                            name: 'titel', title: 'Etappenaam', type: 'string',
                            description: 'Bijv. Dag 1: Maastricht → Dijon'
                        }),
                        defineField({ name: 'afstand_km', title: 'Afstand (km)', type: 'number' }),
                        defineField({
                            name: 'verwacht_verbruik', title: 'Verwacht extra verbruik', type: 'string',
                            description: 'Bijv. +15% door hoogteverschil A6'
                        }),
                        defineField({ name: 'laadtip', title: 'Laadtip voor deze etappe', type: 'text', rows: 2 }),
                        defineField({
                            name: 'campings', title: 'Campings op deze etappe',
                            type: 'array',
                            of: [{ type: 'reference', to: [{ type: 'camping' }] }],
                        }),
                    ],
                    preview: {
                        select: { title: 'titel', subtitle: 'afstand_km' },
                        prepare: ({ title, subtitle }) => ({
                            title: title ?? 'Etappe',
                            subtitle: subtitle ? `${subtitle} km` : '',
                        }),
                    },
                }),

                // Custom block: Checklist
                defineArrayMember({
                    type: 'object',
                    name: 'checklist',
                    title: 'Checklist',
                    fields: [
                        defineField({
                            name: 'titel', title: 'Titel', type: 'string',
                            initialValue: 'Wat neem je mee?'
                        }),
                        defineField({
                            name: 'items', title: 'Items', type: 'array',
                            of: [defineArrayMember({
                                type: 'object',
                                fields: [
                                    defineField({ name: 'label', type: 'string', title: 'Item' }),
                                    defineField({ name: 'affiliate_url', type: 'url', title: 'Affiliate link (optioneel)' }),
                                ],
                            })],
                        }),
                    ],
                    preview: {
                        select: { title: 'titel' },
                        prepare: ({ title }) => ({ title: `Checklist: ${title}` }),
                    },
                }),

                // Afbeeldingen inline
                defineArrayMember({
                    type: 'image',
                    options: { hotspot: true },
                }),
            ],
        }),

        // ── SEO ──
        defineField({
            name: 'seo_titel', title: 'SEO titel', type: 'string',
            group: 'seo',
            description: 'Laat leeg om paginatitel te gebruiken',
        }),
        defineField({
            name: 'seo_beschrijving', title: 'Meta description', type: 'text',
            group: 'seo', rows: 2,
            validation: r => r.max(160).warning('Max 160 tekens voor Google'),
        }),
        defineField({
            name: 'focus_keyword', title: 'Focus keyword', type: 'string',
            group: 'seo',
            description: 'Bijv. campings met laadpaal Frankrijk',
        }),

        // ── Meta ──
        defineField({
            name: 'land', title: 'Land / regio', type: 'string',
            group: 'meta',
        }),
        defineField({
            name: 'geschikt_voor', title: 'Geschikt voor', type: 'array',
            group: 'meta',
            of: [{ type: 'string' }],
            options: {
                list: ['Tesla', 'Caravan', 'Camper', 'Gezin', 'Koppel', 'Solo'],
                layout: 'tags',
            },
        }),
        defineField({
            name: 'gepubliceerd_op', title: 'Publicatiedatum', type: 'date',
            group: 'meta',
        }),
    ],

    preview: {
        select: { title: 'titel', subtitle: 'land', media: 'hero_image' },
        prepare: ({ title, subtitle, media }) => ({
            title,
            subtitle: subtitle ?? '',
            media,
        }),
    },
})