'use client'

import { useEffect, useState } from 'react'
import { loadStripe, Appearance } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import StripePaymentForm from '@/components/StripePaymentForm'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const appearance: Appearance = {
    theme: 'stripe',
    variables: {
        colorPrimary: '#8b5e3c', // clay-600
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#df1b41',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px',
    },
    rules: {
        '.Input': {
            borderBottom: '2px solid #e5e7eb',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderRadius: '0',
            paddingLeft: '0',
            paddingRight: '0',
            boxShadow: 'none',
        },
        '.Input:focus': {
            borderBottom: '2px solid #8b5e3c',
            boxShadow: 'none',
        },
        '.Label': {
            fontWeight: '500',
            color: '#6b7280',
            fontSize: '12px',
            marginBottom: '4px',
        }
    }
}

export default function PaymentPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const clientSecret = searchParams.get('clientSecret')
    const { items, getTotal } = useCart()

    if (!orderId || !clientSecret) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Nevažeći podaci za plaćanje</h1>
                    <p className="text-gray-600">Nedostaju parametri za plaćanje. Molimo pokušajte ponovo iz korpe.</p>
                </div>
            </div>
        )
    }

    const subtotal = getTotal()
    // Note: shipping cost is hardcoded here for simplicity in UI, ideally should come from order details API
    // but since we are mirroring the checkout page, we can assume it's part of the total.
    // In a real app, we'd fetch the order to get the exact total.
    // For now, we'll just show the items and the total will be the total from Stripe if we had it.

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD',
        }).format(amount)
    }

    return (
        <div className="min-h-screen bg-white lg:bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row-reverse">
                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-[45%] bg-gray-50 lg:min-h-screen lg:sticky lg:top-0 p-6 lg:p-12 border-b lg:border-b-0 lg:border-l border-gray-200">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-xl font-semibold text-gray-900 mb-8">Vaša porudžbina</h2>

                            <div className="space-y-6 mb-8 pr-2 custom-scrollbar overflow-y-auto max-h-[40vh] lg:max-h-[60vh]">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <div className="relative h-16 w-16 flex-shrink-0 bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <span className="absolute -top-2 -right-2 h-5 w-5 bg-gray-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-gray-50">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                                            <p className="text-xs text-gray-500">Količina: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Ukupno za plaćanje</span>
                                    <div className="text-right">
                                        <span className="block text-gray-400 text-xs font-normal">RSD</span>
                                        {/* Ideally this total should come from the clientSecret's intent amount */}
                                        {/* For now we show the cart total as a placeholder */}
                                        {formatCurrency(subtotal)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column: Stripe Elements */}
                    <div className="w-full lg:w-[55%] bg-white p-6 lg:p-12">
                        <div className="max-w-xl ml-auto">
                            <div className="mb-10">
                                <Link href="/checkout" className="text-sm text-clay-600 hover:text-clay-700 flex items-center mb-6">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Nazad na unos podataka
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Plaćanje karticom</h1>
                                <p className="text-gray-500">Unesite podatke sa kartice da završite kupovinu.</p>
                            </div>

                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                                    <StripePaymentForm orderId={orderId} />
                                </Elements>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-400">Sigurno plaćanje putem Stripe platforme</span>
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 opacity-30 grayscale" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
        </div>
    )
}
