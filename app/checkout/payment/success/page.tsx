'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function PaymentSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const { clearCart } = useCart()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const finalizeOrder = async () => {
            if (!orderId) {
                setError('Nedostaje ID porudžbine.')
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`/api/orders/${orderId}`)
                if (!response.ok) {
                    throw new Error('Neuspešno preuzimanje podataka o porudžbini.')
                }

                const order = await response.json()
                clearCart()
                router.push(`/order-confirmation/${order.orderNumber}`)
            } catch (err: any) {
                setError(err.message || 'Došlo je do greške pri obradi porudžbine.')
                setLoading(false)
            }
        }

        finalizeOrder()
    }, [orderId, clearCart, router])

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Greška</h1>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-clay-900 text-white px-6 py-3 rounded-full font-semibold"
                    >
                        Nazad na početnu
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 transition-all duration-1000">
            <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-clay-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-clay-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-10 h-10 text-clay-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    Uspelo je!
                </h1>
                <p className="text-gray-500 text-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    Finalizujemo vašu porudžbinu...
                </p>
            </div>
        </div>
    )
}
