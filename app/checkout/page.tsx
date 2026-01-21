'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const checkoutSchema = z.object({
  email: z.string().email('Neispravna email adresa'),
  name: z.string().min(2, 'Ime mora imati najmanje 2 karaktera'),
  phone: z.string().min(8, 'Neispravan broj telefona'),
  shippingAddress: z.string().min(5, 'Adresa mora imati najmanje 5 karaktera'),
  shippingCity: z.string().min(2, 'Grad mora imati najmanje 2 karaktera'),
  shippingZip: z.string().min(4, 'Poštanski broj mora imati najmanje 4 karaktera'),
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['card', 'cash', 'transfer']),
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
      paymentMethod: 'cash',
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

      // If card payment, redirect to Stripe
      if (paymentMethod === 'card') {
        const stripeResponse = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        })

        if (!stripeResponse.ok) {
          throw new Error('Greška pri kreiranju plaćanja')
        }

        const { clientSecret } = await stripeResponse.json()
        // Redirect to Stripe checkout or handle payment
        router.push(`/checkout/payment?orderId=${order.id}&clientSecret=${clientSecret}`)
      } else {
        // For cash or transfer, go to confirmation
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-clay-800 mb-4">
            Vaša korpa je prazna
          </h1>
          <Link
            href="/products"
            className="bg-clay-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-clay-700 transition-colors inline-block"
          >
            Nastavi sa kupovinom
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-clay-800 mb-8">Plaćanje</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="flex justify-between items-center text-2xl font-semibold text-clay-800 mb-4">
              <span>Informacije o kupcu</span>
              {!session && (
                <span className="text-sm font-normal text-clay-600">
                  Već imate nalog?{' '}
                  <Link href="/auth/login?callbackUrl=/checkout" className="text-clay-800 underline hover:text-clay-900">
                    Prijavite se
                  </Link>
                </span>
              )}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-clay-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-clay-700 mb-1">
                  Ime i prezime *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-clay-700 mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-clay-800 mb-4">
              Adresa za dostavu
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-clay-700 mb-1">
                  Adresa *
                </label>
                <input
                  type="text"
                  {...register('shippingAddress')}
                  className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                />
                {errors.shippingAddress && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.shippingAddress.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-1">
                    Grad *
                  </label>
                  <input
                    type="text"
                    {...register('shippingCity')}
                    className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                  />
                  {errors.shippingCity && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.shippingCity.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-clay-700 mb-1">
                    Poštanski broj *
                  </label>
                  <input
                    type="text"
                    {...register('shippingZip')}
                    className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                  />
                  {errors.shippingZip && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.shippingZip.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-clay-700 mb-1">
                  Način dostave *
                </label>
                <select
                  {...register('shippingMethod')}
                  className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                >
                  <option value="standard">Standardna dostava (300 RSD)</option>
                  <option value="express">Ekspres dostava (500 RSD)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-clay-800 mb-4">
              Način plaćanja *
            </h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 border border-clay-300 rounded-lg cursor-pointer hover:bg-clay-50">
                <input
                  type="radio"
                  value="cash"
                  {...register('paymentMethod')}
                  className="text-clay-600 focus:ring-clay-500"
                />
                <div>
                  <span className="font-medium text-clay-800">Pouzećem</span>
                  <p className="text-sm text-clay-600">Plaćanje prilikom preuzimanja</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-4 border border-clay-300 rounded-lg cursor-pointer hover:bg-clay-50">
                <input
                  type="radio"
                  value="transfer"
                  {...register('paymentMethod')}
                  className="text-clay-600 focus:ring-clay-500"
                />
                <div>
                  <span className="font-medium text-clay-800">Bankovni transfer</span>
                  <p className="text-sm text-clay-600">
                    Plaćanje na račun pre slanja
                  </p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-4 border border-clay-300 rounded-lg cursor-pointer hover:bg-clay-50">
                <input
                  type="radio"
                  value="card"
                  {...register('paymentMethod')}
                  className="text-clay-600 focus:ring-clay-500"
                />
                <div>
                  <span className="font-medium text-clay-800">Kartica online</span>
                  <p className="text-sm text-clay-600">Plaćanje karticom preko Stripe</p>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-clay-700 mb-1">
              Napomene (opciono)
            </label>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
              placeholder="Dodatne napomene za porudžbinu..."
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-clay-800 mb-4">
              Pregled porudžbine
            </h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-clay-700">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-clay-800">
                    {new Intl.NumberFormat('sr-RS', {
                      style: 'currency',
                      currency: 'RSD',
                    }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-clay-200 pt-4 space-y-2">
              <div className="flex justify-between text-clay-700">
                <span>Međuzbir:</span>
                <span>
                  {new Intl.NumberFormat('sr-RS', {
                    style: 'currency',
                    currency: 'RSD',
                  }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-clay-700">
                <span>Dostava:</span>
                <span>
                  {new Intl.NumberFormat('sr-RS', {
                    style: 'currency',
                    currency: 'RSD',
                  }).format(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-clay-800 pt-2 border-t border-clay-200">
                <span>Ukupno:</span>
                <span>
                  {new Intl.NumberFormat('sr-RS', {
                    style: 'currency',
                    currency: 'RSD',
                  }).format(total)}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-clay-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-clay-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Obrada...' : 'Potvrdi porudžbinu'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

