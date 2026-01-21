import { prisma } from '@/lib/prisma'
import ProductForm from '../product-form'

export default async function NewProductPage() {
    const categories = await prisma.category.findMany()

    return (
        <div>
            <h1 className="text-3xl font-bold text-clay-800 mb-8">Dodaj Novi Proizvod</h1>
            <ProductForm categories={categories} />
        </div>
    )
}
