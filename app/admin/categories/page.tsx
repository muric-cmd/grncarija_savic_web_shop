import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DeleteCategoryButton from './delete-category-button'

export default async function CategoriesPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/admin/login')
    }

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { products: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-clay-800">Kategorije</h1>
                <Link
                    href="/admin/categories/new"
                    className="bg-clay-600 text-white px-6 py-2 rounded-lg hover:bg-clay-700 transition-colors"
                >
                    + Dodaj Kategoriju
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-clay-200">
                    <thead className="bg-clay-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-clay-700 uppercase tracking-wider">
                                Naziv
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-clay-700 uppercase tracking-wider">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-clay-700 uppercase tracking-wider">
                                Broj Proizvoda
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-clay-700 uppercase tracking-wider">
                                Akcije
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-clay-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-clay-500">
                                    Nema kategorija. Kreirajte prvu kategoriju.
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-clay-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-clay-900">
                                            {category.name}
                                        </div>
                                        {category.description && (
                                            <div className="text-sm text-clay-500 truncate max-w-md">
                                                {category.description}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-clay-700">
                                        {category.slug}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-clay-700">
                                        {category._count.products}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <Link
                                            href={`/admin/categories/${category.id}`}
                                            className="text-clay-600 hover:text-clay-900"
                                        >
                                            Uredi
                                        </Link>
                                        <DeleteCategoryButton
                                            categoryId={category.id}
                                            categoryName={category.name}
                                            productCount={category._count.products}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
