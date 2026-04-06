'use client'

import { useState } from 'react'
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'

export default function StripePaymentForm({ orderId }: { orderId: string }) {
    const stripe = useStripe()
    const elements = useElements()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/payment/success?orderId=${orderId}`,
            },
        })

        if (error) {
            setErrorMessage(error.message || 'Plaćanje nije uspelo. Molimo pokušajte ponovo.')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-2 rounded-lg">
                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />
            </div>

            {errorMessage && (
                <div className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
                    {errorMessage}
                </div>
            )}

            <button
                disabled={!stripe || loading}
                className="w-full bg-clay-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl mt-4"
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Obrađujemo...
                    </span>
                ) : (
                    `Plati odmah`
                )}
            </button>

            <p className="text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                Sigurna transakcija putem Stripe-a
            </p>

            <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
        </form>
    )
}
