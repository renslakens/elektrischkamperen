import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'laadpaal',
    title: 'Laadpaal',
    type: 'document',
    fields: [
        defineField({
            name: 'naam', title: 'Naam / locatie', type: 'string',
            description: 'Bijv. Fastned A2 Eindhoven',
            validation: r => r.required(),
        }),
        defineField({
            name: 'ocm_id', title: 'OpenChargeMap ID', type: 'string',
            description: 'Wordt ingevuld als je de OCM-sync later inbouwt',
        }),
        defineField({
            name: 'locatie', title: 'Locatie', type: 'geopoint',
        }),
        defineField({
            name: 'max_kw', title: 'Max vermogen (kW)', type: 'number',
        }),
        defineField({
            name: 'netwerk', title: 'Netwerk', type: 'string',
            options: {
                list: ['Fastned', 'Ionity', 'Allego', 'Shell Recharge', 'Tesla', 'Overig'],
            },
        }),
        defineField({
            name: 'connector_types', title: 'Connector types', type: 'array',
            of: [{ type: 'string' }],
            options: { list: ['CCS', 'CHAdeMO', 'Type 2'], layout: 'tags' },
        }),
        defineField({
            name: 'notitie', title: 'Notitie', type: 'text', rows: 2,
        }),
    ],
    preview: {
        select: { title: 'naam', subtitle: 'max_kw', subtitle2: 'netwerk' },
        prepare: ({ title, subtitle, subtitle2 }) => ({
            title,
            subtitle: subtitle ? `⚡ ${subtitle} kW — ${subtitle2 ?? ''}` : subtitle2,
        }),
    },
})