import { prisma } from '@/lib/prisma'
import ProductForm from '../product-form'
import { notFound } from 'next/navigation'

export default async function EditProductPage({
    params
}: {
    params: { id: string }
}) {
    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id: params.id },
        }),
        prisma.category.findMany(),
    ])

    if (!product) {
        notFound()
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-clay-800 mb-8">Izmeni Proizvod</h1>
            <ProductForm categories={categories} initialData={product} />
        </div>
    )
}
