import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { Suspense } from 'react'
import ProductsFilter from '@/components/ProductsFilter'

export const metadata = {
  title: 'Proizvodi - Grnčarija Savić',
  description: 'Pregledajte našu kolekciju rukom izrađene keramike',
}

interface SearchParams {
  category?: string
  search?: string
  minPrice?: string
  maxPrice?: string
  inStock?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  const where: any = {
    active: true,
  }

  if (searchParams.category) {
    where.category = { slug: searchParams.category }
  }

  if (searchParams.search) {
    // SQLite doesn't support case-insensitive search, so we'll do a simple contains
    // For production with PostgreSQL, you can use: mode: 'insensitive'
    const searchTerm = searchParams.search.toLowerCase()
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
    ]
  }

  if (searchParams.minPrice) {
    where.price = { gte: parseFloat(searchParams.minPrice) }
  }

  if (searchParams.maxPrice) {
    where.price = {
      ...where.price,
      lte: parseFloat(searchParams.maxPrice),
    }
  }

  if (searchParams.inStock === 'true') {
    where.stock = { gt: 0 }
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  const maxPrice = await prisma.product.aggregate({
    where: { active: true },
    _max: { price: true },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-clay-800 mb-4">Proizvodi</h1>
        <p className="text-lg text-clay-700">
          Pregledajte našu kolekciju rukom izrađene keramike
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Suspense fallback={<div>Učitavanje...</div>}>
            <ProductsFilter
              categories={categories}
              maxPrice={maxPrice._max.price || 10000}
              searchParams={searchParams}
            />
          </Suspense>
        </aside>

        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-clay-700 mb-4">
                Nismo pronašli proizvode koji odgovaraju vašim kriterijumima.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

