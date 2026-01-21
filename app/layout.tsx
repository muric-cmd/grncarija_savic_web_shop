import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Grnčarija Savić - Tradicionalna Rukom Izrađena Keramika',
  description: 'Tradicionalna grnčarija i keramika rukom izrađena sa pažnjom i ljubavlju. Posude, vaze, tanjiri i lonci od terakote.',
  keywords: 'grnčarija, keramika, terakota, posude, vaze, tanjiri, lonci, rukom izrađeno',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr">
      <body className={inter.className}>
        <CartProvider>
          <Providers>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </Providers>
        </CartProvider>
      </body>
    </html>
  )
}

