import 'server-only'
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Alleen server-side gebruiken. Het token heeft schrijfrechten en mag nooit in client-code
// of een NEXT_PUBLIC_-variabele terechtkomen; `server-only` laat de build falen als dit
// bestand in een client component wordt geïmporteerd.
export function maakWriteClient() {
    const token = process.env.SANITY_API_WRITE_TOKEN
    if (!token) {
        throw new Error('SANITY_API_WRITE_TOKEN ontbreekt')
    }
    return createClient({ projectId, dataset, apiVersion, token, useCdn: false })
}
