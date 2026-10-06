import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { GoogleTagManager } from '@next/third-parties/google'
import { Nav } from '@/components/ui/Nav'
import { Footer } from '@/components/ui/Footer'
import { maakMetadata } from '@/lib/metadata'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Google Tag Manager: alleen laden als NEXT_PUBLIC_GTM_ID is gezet (Vercel).
// Toestemming (Consent Mode) en de GA4-tags regel je in de GTM-container zelf.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export const metadata = maakMetadata({
  titel: 'Elektrisch Kamperen — EV-campings & routes in Europa',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900 antialiased`}>
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}