import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetails from './product-details'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })

  if (!product) {
    return { title: 'Proizvod nije pronađen' }
  }

  return {
    title: `${product.name} | Grnčarija Savić`,
    description: product.description.substring(0, 160),
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      variants: true
    },
  })

  if (!product || !product.active) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductDetails product={product} />
    </div>
  )
}
