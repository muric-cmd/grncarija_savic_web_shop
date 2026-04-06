import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderNumber: string }
}) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-clay-800 mb-4">
          Porudžbina je primljena!
        </h1>
        <p className="text-lg text-clay-700 mb-8">
          Hvala vam na porudžbini. Broj vaše porudžbine je:{' '}
          <span className="font-semibold">{order.orderNumber}</span>
        </p>

        <div className="bg-clay-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold text-clay-800 mb-4">
            Detalji porudžbine
          </h2>
          <div className="space-y-2 text-clay-700">
            <p>
              <span className="font-semibold">Email:</span> {order.email}
            </p>
            <p>
              <span className="font-semibold">Telefon:</span> {order.phone}
            </p>
            <p>
              <span className="font-semibold">Adresa:</span> {order.shippingAddress},{' '}
              {order.shippingCity} {order.shippingZip}
            </p>
            <p>
              <span className="font-semibold">Način dostave:</span>{' '}
              {order.shippingMethod === 'express' ? 'Ekspres' : 'Standardna'}
            </p>
            <p>
              <span className="font-semibold">Način plaćanja:</span>{' '}
              {order.paymentMethod === 'card'
                ? 'Kartica online'
                : 'Pouzećem'}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{' '}
              <span className="capitalize">{order.status}</span>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-clay-200">
            <h3 className="font-semibold text-clay-800 mb-2">Proizvodi:</h3>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-clay-700">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>
                    {new Intl.NumberFormat('sr-RS', {
                      style: 'currency',
                      currency: 'RSD',
                    }).format(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-clay-200 flex justify-between font-semibold text-clay-800">
              <span>Ukupno:</span>
              <span>
                {new Intl.NumberFormat('sr-RS', {
                  style: 'currency',
                  currency: 'RSD',
                }).format(order.total)}
              </span>
            </div>
          </div>
        </div>


        <div className="space-x-4">
          <Link
            href="/products"
            className="bg-clay-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-clay-700 transition-colors inline-block"
          >
            Nastavi sa kupovinom
          </Link>
          <Link
            href="/"
            className="bg-clay-200 text-clay-800 px-8 py-3 rounded-lg font-semibold hover:bg-clay-300 transition-colors inline-block"
          >
            Nazad na početnu
          </Link>
        </div>
      </div>
    </div>
  )
}

