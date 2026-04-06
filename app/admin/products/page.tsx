import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import DeleteProductButton from './delete-product-button'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-clay-800">Proizvodi</h1>
        <Link
          href="/admin/products/new"
          className="bg-clay-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-clay-700 transition-colors"
        >
          Dodaj Proizvod
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-clay-50">
            <tr>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Slika
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Naziv
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Kategorija
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Cena
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Zaliha
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Status
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const images = JSON.parse(product.images || '[]')
              return (
                <tr key={product.id} className="border-b border-clay-100">
                  <td className="py-3 px-4">
                    <div className="relative w-16 h-16 bg-clay-100 rounded overflow-hidden">
                      {images[0] ? (
                        <Image
                          src={images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-clay-400 text-xs">
                          Nema
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-clay-600 hover:text-clay-700 font-medium"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-clay-700">
                    {product.category.name}
                  </td>
                  <td className="py-3 px-4 text-clay-700">
                    {new Intl.NumberFormat('sr-RS', {
                      style: 'currency',
                      currency: 'RSD',
                    }).format(product.price)}
                  </td>
                  <td className="py-3 px-4 text-clay-700">{product.stock}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${product.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {product.active ? 'Aktivan' : 'Neaktivan'}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-clay-600 hover:text-clay-700 text-sm"
                    >
                      Izmeni
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

