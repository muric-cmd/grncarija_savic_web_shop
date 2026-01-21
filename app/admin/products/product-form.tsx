'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

interface Category {
    id: string
    name: string
}

interface ProductFormProps {
    categories: Category[]
    initialData?: any
}

interface Variant {
    id?: string
    name: string
    price: number
    stock: number
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        stock: initialData?.stock || 0,
        categoryId: initialData?.categoryId || categories[0]?.id || '',
        images: initialData?.images ? JSON.parse(initialData.images) : [],
        dimensions: initialData?.dimensions || '',
        material: initialData?.material || '',
        featured: initialData?.featured || false,
        active: initialData?.active ?? true,
    })

    // Parse initial variants or start with empty array
    const [variants, setVariants] = useState<Variant[]>(
        initialData?.variants || []
    )

    const handleAddVariant = () => {
        setVariants([...variants, { name: '', price: 0, stock: 0 }])
    }

    const handleRemoveVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index))
    }

    const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
        const newVariants = [...variants]
        if (field === 'price' || field === 'stock') {
            newVariants[index] = { ...newVariants[index], [field]: Number(value) }
        } else {
            newVariants[index] = { ...newVariants[index], [field]: value as string }
        }
        setVariants(newVariants)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock.toString()),
                images: JSON.stringify(formData.images),
                variants,
            }

            const url = initialData
                ? `/api/products/${initialData.id}`
                : '/api/products'

            const method = initialData ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                throw new Error('Došlo je do greške pri čuvanju proizvoda')
            }

            router.push('/admin/products')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-md">
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-clay-700">Naziv</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-clay-700">Slug (URL)</label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-clay-700">Kategorija</label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-clay-700">Osnovna Cena (RSD)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-clay-700">Ukupna Zaliha</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-clay-700">Dimenzije</label>
                        <input
                            type="text"
                            value={formData.dimensions}
                            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-clay-700">Materijal</label>
                        <input
                            type="text"
                            value={formData.material}
                            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-clay-700">Opis</label>
                        <textarea
                            rows={4}
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-clay-700 mb-2">
                            Slike
                        </label>
                        <ImageUpload
                            value={formData.images}
                            onChange={(url) => setFormData({ ...formData, images: url as any })}
                        />
                    </div>

                    <div className="flex space-x-6 pt-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="rounded text-clay-600 focus:ring-clay-500"
                            />
                            <span className="text-sm font-medium text-clay-700">Izdvojeno</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="rounded text-clay-600 focus:ring-clay-500"
                            />
                            <span className="text-sm font-medium text-clay-700">Aktivno</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Variants Section */}
            <div className="border-t border-clay-200 pt-8">
                <h3 className="text-lg font-medium text-clay-800 mb-4">Varijante Proizvoda (Opciono)</h3>
                <p className="text-sm text-clay-600 mb-4">Dodajte različite varijante (npr. veličine) sa različitim cenama.</p>

                <div className="space-y-4">
                    {variants.map((variant, index) => (
                        <div key={index} className="flex flex-wrap gap-4 items-end bg-clay-50 p-4 rounded-md">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-xs font-medium text-clay-700 mb-1">Naziv (npr. Velika)</label>
                                <input
                                    type="text"
                                    value={variant.name}
                                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                    className="w-full rounded-md border border-clay-300 px-3 py-2 text-sm"
                                    placeholder="Naziv varijante"
                                />
                            </div>
                            <div className="w-32">
                                <label className="block text-xs font-medium text-clay-700 mb-1">Cena</label>
                                <input
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                    className="w-full rounded-md border border-clay-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-medium text-clay-700 mb-1">Zaliha</label>
                                <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                    className="w-full rounded-md border border-clay-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveVariant(index)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-2"
                            >
                                Ukloni
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddVariant}
                        className="text-sm text-clay-600 hover:text-clay-800 font-medium flex items-center"
                    >
                        + Dodaj Varijantu
                    </button>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-clay-200">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mr-4 px-4 py-2 text-clay-600 hover:text-clay-800 font-medium"
                >
                    Otkaži
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-clay-600 text-white rounded-md hover:bg-clay-700 disabled:opacity-50"
                >
                    {loading ? 'Čuvanje...' : 'Sačuvaj Proizvod'}
                </button>
            </div>
        </form>
    )
}
