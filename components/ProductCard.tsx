import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@prisma/client'

interface ProductCardProps {
  product: Product & { category: { name: string; slug: string } }
}

export default function ProductCard({ product }: ProductCardProps) {
  const images = JSON.parse(product.images || '[]')
  const mainImage = images[0] || '/placeholder-product.jpg'
  const price = new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
  }).format(product.price)

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-64 bg-clay-100">
          {mainImage !== '/placeholder-product.jpg' ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-clay-400">
              <span>Nema slike</span>
            </div>
          )}
          {product.featured && (
            <span className="absolute top-2 right-2 bg-clay-600 text-white text-xs px-2 py-1 rounded">
              Istaknuto
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-clay-600 mb-1">{product.category.name}</p>
          <h3 className="text-lg font-semibold text-clay-800 mb-2">
            {product.name}
          </h3>
          <p className="text-clay-700 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-clay-800">{price}</span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600">Na stanju</span>
            ) : (
              <span className="text-sm text-red-600">Nema na stanju</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

