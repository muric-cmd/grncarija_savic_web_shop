'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Image from 'next/image'

const checkoutSchema = z.object({
  email: z.string().email('Neispravna email adresa'),
  name: z.string().min(2, 'Ime mora imati najmanje 2 karaktera'),
  phone: z.string().min(8, 'Neispravan broj telefona'),
  shippingAddress: z.string().min(5, 'Adresa mora imati najmanje 5 karaktera'),
  shippingCity: z.string().min(2, 'Grad mora imati najmanje 2 karaktera'),
  shippingZip: z.string().min(4, 'Poštanski broj mora imati najmanje 4 karaktera'),
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['card', 'cash']),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: 'standard',
      paymentMethod: 'card',
    },
  })

  const shippingMethod = watch('shippingMethod')
  const paymentMethod = watch('paymentMethod')

  useEffect(() => {
    if (session?.user) {
      if (session.user.email) setValue('email', session.user.email)
      if (session.user.name) setValue('name', session.user.name)
    }
  }, [session, setValue])

  const subtotal = getTotal()
  const shippingCost = shippingMethod === 'express' ? 500 : 300
  const total = subtotal + shippingCost

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      setError('Korpa je prazna')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
          userId: session?.user?.id,
          subtotal,
          shippingCost,
          total,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Greška pri kreiranju porudžbine')
      }

      const order = await response.json()

      if (paymentMethod === 'card') {
        const stripeResponse = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        })

        if (!stripeResponse.ok) {
          const errorData = await stripeResponse.json()
          throw new Error(errorData.error || 'Greška pri kreiranju plaćanja')
        }

        const { clientSecret } = await stripeResponse.json()
        router.push(`/checkout/payment?orderId=${order.id}&clientSecret=${clientSecret}`)
      } else {
        clearCart()
        router.push(`/order-confirmation/${order.orderNumber}`)
      }
    } catch (err: any) {
      setError(err.message || 'Došlo je do greške')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-clay-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-clay-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Vaša korpa je prazna</h1>
          <p className="text-gray-600 mb-8">Izgleda da još niste dodali nijedan proizvod u korpu.</p>
          <Link
            href="/products"
            className="bg-clay-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-clay-700 transition-all shadow-lg hover:shadow-xl inline-block"
          >
            Istražite proizvode
          </Link>
        </div>
      </div>
    )
  }

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
          {/* Right Column: Order Summary (Visible first on mobile) */}
          <div className="w-full lg:w-[45%] bg-gray-50 lg:min-h-screen lg:sticky lg:top-0 p-6 lg:p-12 border-b lg:border-b-0 lg:border-l border-gray-200">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-8 hidden lg:block">Pregled porudžbine</h2>

              <div className="space-y-6 mb-8 overflow-y-auto max-h-[40vh] lg:max-h-none pr-2 custom-scrollbar">
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

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Međuzbir</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Dostava</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Ukupno</span>
                  <div className="text-right">
                    <span className="block text-gray-400 text-xs font-normal">RSD</span>
                    {formatCurrency(total)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Checkout Form */}
          <div className="w-full lg:w-[55%] bg-white p-6 lg:p-12">
            <div className="max-w-xl ml-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm animate-shake">
                    {error}
                  </div>
                )}

                {/* Section 1: Customer */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Kontakt</h2>
                    {!session && (
                      <span className="text-sm text-gray-500">
                        Imate nalog?{' '}
                        <Link href="/auth/login?callbackUrl=/checkout" className="text-clay-600 hover:text-clay-700 font-medium">
                          Prijavite se
                        </Link>
                      </span>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="group relative">
                      <label className="block text-xs font-medium text-gray-500 mb-1 transition-all group-focus-within:text-clay-600">
                        Email adresa
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="npr. jovan@email.com"
                        className="w-full px-0 py-2 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-clay-500 transition-colors text-gray-900 placeholder-gray-300"
                      />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="group relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1 transition-all group-focus-within:text-clay-600">
                          Ime i prezime
                        </label>
                        <input
                          type="text"
                          {...register('name')}
                          className="w-full px-0 py-2 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-clay-500 transition-colors text-gray-900"
                        />
                        {errors.name && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.name.message}</p>}
                      </div>
                      <div className="group relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1 transition-all group-focus-within:text-clay-600">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          className="w-full px-0 py-2 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-clay-500 transition-colors text-gray-900"
                        />
                        {errors.phone && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.phone.message}</p>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2: Delivery */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Adresa za dostavu</h2>
                  <div className="space-y-6">
                    <div className="group relative">
                      <label className="block text-xs font-medium text-gray-500 mb-1 transition-all group-focus-within:text-clay-600">
                        Adresa i broj stana
                      </label>
                      <input
                        type="text"
                        {...register('shippingAddress')}
                        className="w-full px-0 py-2 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-clay-500 transition-colors text-gray-900"
                      />
                      {errors.shippingAddress && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.shippingAddress.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="group relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1 transition-all group-focus-within:text-clay-600">
                          Grad
                        </label>
                        <input
                          type="text"
                          {...register('shippingCity')}
                          className="w-full px-0 py-2 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-clay-500 transition-colors text-gray-900"
                        />
                        {errors.shippingCity && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.shippingCity.message}</p>}
                      </div>
                      <div className="group relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1 transition-all group-focus-within:text-clay-600">
                          Poštanski broj
                        </label>
                        <input
                          type="text"
                          {...register('shippingZip')}
                          className="w-full px-0 py-2 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-clay-500 transition-colors text-gray-900"
                        />
                        {errors.shippingZip && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.shippingZip.message}</p>}
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="block text-xs font-medium text-gray-500 mb-3 uppercase tracking-widest">Metod dostave</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-clay-500 bg-clay-50' : 'border-gray-100 hover:border-gray-300'}`}>
                          <input type="radio" value="standard" {...register('shippingMethod')} className="sr-only" />
                          <span className="font-semibold text-gray-900">Standardna</span>
                          <span className="text-xs text-gray-500">300 RSD • 3-5 radnih dana</span>
                        </label>
                        <label className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-clay-500 bg-clay-50' : 'border-gray-100 hover:border-gray-300'}`}>
                          <input type="radio" value="express" {...register('shippingMethod')} className="sr-only" />
                          <span className="font-semibold text-gray-900">Ekspres</span>
                          <span className="text-xs text-gray-500">500 RSD • 1-2 radna dana</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: Payment Method Selection */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Način plaćanja</h2>
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-clay-500 bg-clay-50' : 'border-gray-100 hover:border-gray-300'}`}>
                      <input type="radio" value="card" {...register('paymentMethod')} className="sr-only" />
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300 mr-4 flex items-center justify-center">
                        {paymentMethod === 'card' && <div className="h-2 w-2 rounded-full bg-clay-600" />}
                      </div>
                      <div className="flex-1">
                        <span className="block font-semibold text-sm text-gray-900">Platna kartica</span>
                        <span className="text-xs text-gray-500 flex items-center mt-1">
                          Sva plaćanja su sigurna i kriptovana putem Stripe-a
                        </span>
                      </div>
                      <div className="flex space-x-1 opacity-60">
                        <div className="w-8 h-5 bg-gray-200 rounded animate-pulse" /> {/* Card icons placeholder */}
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-clay-500 bg-clay-50' : 'border-gray-100 hover:border-gray-300'}`}>
                      <input type="radio" value="cash" {...register('paymentMethod')} className="sr-only" />
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300 mr-4 flex items-center justify-center">
                        {paymentMethod === 'cash' && <div className="h-2 w-2 rounded-full bg-clay-600" />}
                      </div>
                      <div className="flex-1">
                        <span className="block font-semibold text-sm text-gray-900">Pouzećem</span>
                        <span className="text-xs text-gray-500 mt-1">Platite gotovinom kada paket stigne</span>
                      </div>
                    </label>
                  </div>
                </section>

                {/* Submit */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-clay-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
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
                      paymentMethod === 'card' ? 'Nastavi na plaćanje' : 'Potvrdi porudžbinu'
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em]">
                    Sigurna kupovina • Enkriptovana transakcija
                  </p>
                </div>
              </form>
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  )
}
