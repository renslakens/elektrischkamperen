import { defineType, defineField } from "sanity";

export default defineType({
    name: 'route',
    title: 'Route',
    type: 'document',
    fields: [
        defineField({
            name: 'featured',
            title: 'Uitgelicht op homepage',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({ name: 'titel', title: 'Titel', type: 'string', validation: r => r.required() }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titel' }, validation: r => r.required() }),
        defineField({ name: 'beschrijving', title: 'Beschrijving', type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'totale_km', title: 'Totale afstand (km)', type: 'number' }),
        defineField({ name: 'caravan_geschikt', title: 'Caravan geschikt?', type: 'boolean' }),
        defineField({
            name: 'landen', title: 'Landen', type: 'array', of: [{ type: 'string' }],
            options: { list: ['Nederland', 'België', 'Duitsland', 'Frankrijk', 'Italië', 'Spanje', 'Oostenrijk'] }
        }),
        defineField({
            name: 'etappes', title: 'Etappes', type: 'array',
            of: [{ type: 'reference', to: [{ type: 'etappe' }] }]
        }),
        defineField({ name: 'seo_titel', title: 'SEO titel', type: 'string' }),
        defineField({ name: 'seo_beschrijving', title: 'SEO beschrijving', type: 'text', rows: 2 }),
        defineField({ name: 'thumbnail', title: 'Thumbnail', type: 'image', options: { hotspot: true } }),
    ],
})