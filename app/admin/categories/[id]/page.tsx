import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import CategoryForm from '../category-form'

export default async function EditCategoryPage({
    params,
}: {
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/admin/login')
    }

    const category = await prisma.category.findUnique({
        where: { id: params.id },
    })

    if (!category) {
        notFound()
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-clay-800 mb-6">Uredi Kategoriju</h1>
            <CategoryForm initialData={category} />
        </div>
    )
}
