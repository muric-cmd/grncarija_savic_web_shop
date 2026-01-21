'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()
  const total = getTotal()
  const formattedTotal = new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
  }).format(total)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-clay-800 mb-4">Vaša korpa je prazna</h1>
          <p className="text-lg text-clay-700 mb-8">
            Dodajte proizvode u korpu da nastavite sa kupovinom
          </p>
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
      <h1 className="text-4xl font-bold text-clay-800 mb-8">Korpa</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const itemTotal = item.price * item.quantity
            const formattedPrice = new Intl.NumberFormat('sr-RS', {
              style: 'currency',
              currency: 'RSD',
            }).format(item.price)
            const formattedItemTotal = new Intl.NumberFormat('sr-RS', {
              style: 'currency',
              currency: 'RSD',
            }).format(itemTotal)

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-6"
              >
                <div className="relative w-full sm:w-32 h-32 bg-clay-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-clay-800 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-clay-600 mb-4">{formattedPrice} po komadu</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-clay-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="px-3 py-1 text-clay-700 hover:bg-clay-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-3 py-1 text-clay-700 hover:bg-clay-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-clay-800">
                        {formattedItemTotal}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-sm text-red-600 hover:text-red-700 mt-2"
                      >
                        Ukloni
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <button
            onClick={clearCart}
            className="text-clay-600 hover:text-clay-700 underline"
          >
            Obriši celu korpu
          </button>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-clay-800 mb-4">
              Pregled porudžbine
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-clay-700">
                <span>Ukupno:</span>
                <span className="font-semibold">{formattedTotal}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-clay-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-clay-700 transition-colors"
            >
              Nastavi na plaćanje
            </Link>
            <Link
              href="/products"
              className="block w-full text-center mt-4 text-clay-600 hover:text-clay-700"
            >
              Nastavi sa kupovinom
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

