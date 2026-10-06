'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './sanity/env'
import { structure } from './sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'elektrischkamperen',
  title: 'Elektrisch Kamperen CMS',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Aanmeldingen komen alleen via het formulier binnen, niet via "nieuw document"
    templates: (prev) => prev.filter((template) => template.schemaType !== 'aanmelding'),
  },
  document: {
    // Aanmeldingen bevatten contactgegevens en mogen nooit gepubliceerd worden (publieke dataset)
    actions: (prev, context) =>
      context.schemaType === 'aanmelding'
        ? prev.filter(({ action }) => action !== 'publish' && action !== 'duplicate')
        : prev,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Gidsen').schemaType('gids').child(
              S.documentTypeList('gids')
            ),
            S.listItem().title('Routes').schemaType('route').child(
              S.documentTypeList('route')
            ),
            S.listItem().title('Etappes').schemaType('etappe').child(
              S.documentTypeList('etappe')
            ),
            S.divider(),
            S.listItem().title('Campings').schemaType('camping').child(
              S.documentTypeList('camping')
            ),
            S.listItem().title('Laadpalen').schemaType('laadpaal').child(
              S.documentTypeList('laadpaal')
            ),
            S.divider(),
            S.listItem().title('Aanmeldingen').schemaType('aanmelding').child(
              S.documentTypeList('aanmelding').defaultOrdering([{ field: 'ingediend_op', direction: 'desc' }])
            ),
          ]),
    }),
  ],
})
