import type { PortableTextComponents } from '@portabletext/react'
import { CampingCard } from './CampingCard'
import { EtappeBlock } from './EtappeBlock'
import { ChecklistBlock } from './Checklist'

export const portableTextComponents: PortableTextComponents = {
    types: {
        campingCard: CampingCard,
        etappeBlok: EtappeBlock,
        checklist: ChecklistBlock,
    },
}