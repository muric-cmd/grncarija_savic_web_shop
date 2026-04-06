import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CategoryForm from '../category-form'

export default async function NewCategoryPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/admin/login')
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-clay-800 mb-6">Nova Kategorija</h1>
            <CategoryForm />
        </div>
    )
}
