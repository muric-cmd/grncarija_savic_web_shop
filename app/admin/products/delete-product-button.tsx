'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteProductButtonProps {
    productId: string
    productName: string
}

export default function DeleteProductButton({
    productId,
    productName,
}: DeleteProductButtonProps) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleDelete = async () => {
        setLoading(true)
        setError('')

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Greška pri brisanju')
            }

            router.refresh()
            setShowModal(false)
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="text-red-600 hover:text-red-900 text-sm"
            >
                Obriši
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-clay-800 mb-4">
                            Potvrda brisanja
                        </h3>
                        <p className="text-clay-700 mb-6">
                            Da li ste sigurni da želite da obrišete proizvod{' '}
                            <strong>{productName}</strong>?
                        </p>
                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                className="px-4 py-2 text-clay-600 hover:text-clay-800 disabled:opacity-50"
                            >
                                Otkaži
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? 'Brisanje...' : 'Obriši'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
