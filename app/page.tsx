import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import Image from 'next/image'

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, active: true },
    take: 6,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-clay-100 to-clay-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-clay-800 mb-6">
            Grnčarija Savić
          </h1>
          <p className="text-xl md:text-2xl text-clay-700 mb-8 max-w-3xl mx-auto">
            Tradicionalna rukom izrađena keramika sa pažnjom i ljubavlju
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-clay-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-clay-700 transition-colors"
            >
              Pogledaj Proizvode
            </Link>
            <Link
              href="/about"
              className="bg-white text-clay-600 px-8 py-3 rounded-lg font-semibold hover:bg-clay-50 transition-colors border-2 border-clay-600"
            >
              O Nama
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-clay-800 mb-6">
                Tradicija i Zanatstvo
              </h2>
              <p className="text-lg text-clay-700 mb-4">
                Naša porodična radionica prenosi veštinu grnčarije kroz generacije.
                Svaki proizvod je rukom izrađen sa pažnjom i ljubavlju, koristeći
                tradicionalne tehnike i prirodne materijale.
              </p>
              <p className="text-lg text-clay-700 mb-6">
                Naša keramika kombinuje funkcionalnost sa estetikom, stvarajući
                proizvode koji su ne samo korisni već i lepi dekorativni elementi
                vašeg doma.
              </p>
              <Link
                href="/about"
                className="text-clay-600 font-semibold hover:text-clay-700 underline"
              >
                Saznaj više o nama →
              </Link>
            </div>
            <div className="relative h-96 bg-clay-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-clay-600">
                <span className="text-lg">Slika radionice</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 bg-clay-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-clay-800 mb-4">
                Istaknuti Proizvodi
              </h2>
              <p className="text-lg text-clay-700">
                Naši najpopularniji i najkvalitetniji proizvodi
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="bg-clay-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-clay-700 transition-colors inline-block"
              >
                Vidi Sve Proizvode
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-clay-800 mb-12 text-center">
            Naš Proces
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-clay-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-clay-800 mb-2">
                Priprema Gline
              </h3>
              <p className="text-clay-700">
                Pažljivo biramo i pripremamo prirodnu glinu za našu keramiku
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-clay-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-clay-800 mb-2">
                Oblikovanje
              </h3>
              <p className="text-clay-700">
                Rukom oblikujemo svaki proizvod koristeći tradicionalne tehnike
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-clay-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-clay-800 mb-2">
                Pečenje i Završna Obrađa
              </h3>
              <p className="text-clay-700">
                Pečemo u tradicionalnoj peći i pažljivo završavamo svaki detalj
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

