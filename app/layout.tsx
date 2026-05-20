import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { Nav } from '@/components/ui/Nav'
import { Footer } from '@/components/ui/Footer'
import { maakMetadata } from '@/lib/metadata'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = maakMetadata({
  titel: 'Elektrisch Kamperen — EV-campings & routes in Europa',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900 antialiased`}>
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}