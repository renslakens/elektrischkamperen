import { defineType, defineField } from "sanity";

export default defineType({
    name: 'etappe',
    title: 'Etappe',
    type: 'document',
    fields: [
        defineField({ name: 'naam', title: 'Naam', type: 'string', validation: r => r.required() }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'naam' } }),
        defineField({ name: 'afstand_km', title: 'Afstand (km)', type: 'number' }),
        defineField({ name: 'hoogteverschil_m', title: 'Hoogteverschil (m)', type: 'number' }),
        defineField({
            name: 'extra_verbruik_procent', title: 'Extra verbruik (%)', type: 'number',
            description: 'Bijv. 15 voor 15% meer verbruik door heuvelachtig terrein'
        }),
        defineField({ name: 'rijdtips', title: 'Rijdtips', type: 'array', of: [{ type: 'block' }] }),
        defineField({
            name: 'campings', title: 'Campings', type: 'array',
            of: [{ type: 'reference', to: [{ type: 'camping' }] }]
        }),
        defineField({
            name: 'laadpalen', title: 'Laadpalen langs route', type: 'array',
            of: [{ type: 'reference', to: [{ type: 'laadpaal' }] }]
        }),
        defineField({
            name: 'polyline', title: 'Route polyline (GeoJSON)', type: 'text',
            description: 'Wordt later gebruikt voor PostGIS queries in Supabase'
        }),
    ],
})