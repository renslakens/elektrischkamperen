import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { GoogleTagManager } from '@next/third-parties/google'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { Nav } from '@/components/ui/Nav'
import { Footer } from '@/components/ui/Footer'
import { maakMetadata } from '@/lib/metadata'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Google Tag Manager: alleen laden als NEXT_PUBLIC_GTM_ID is gezet (Vercel).
// Toestemming loopt via Consent Mode (script hieronder + CookieBanner); GA4-tags staan in de GTM-container.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export const metadata = maakMetadata({
  titel: 'Elektrisch Kamperen — EV-campings & routes in Europa',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
      {/* Consent Mode v2: standaard alles geweigerd, vóór GTM laadt.
          Terugkerende bezoekers die eerder akkoord gingen krijgen analytics_storage direct 'granted'. */}
      <Script id="consent-default" strategy="beforeInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        var ekAkkoord = false;
        try { ekAkkoord = localStorage.getItem('ek-consent') === 'granted'; } catch (e) {}
        gtag('consent', 'default', {
          analytics_storage: ekAkkoord ? 'granted' : 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
      `}</Script>
      </head>
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900 antialiased`}>
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}