import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import UpdateOrderStatus from '@/components/admin/UpdateOrderStatus'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
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
    <div>
      <h1 className="text-4xl font-bold text-clay-800 mb-8">
        Porudžbina {order.orderNumber}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-clay-800 mb-4">
              Proizvodi
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-clay-100 pb-4"
                >
                  <div>
                    <p className="font-medium text-clay-800">{item.product.name}</p>
                    <p className="text-sm text-clay-600">
                      {item.quantity} x{' '}
                      {new Intl.NumberFormat('sr-RS', {
                        style: 'currency',
                        currency: 'RSD',
                      }).format(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold text-clay-800">
                    {new Intl.NumberFormat('sr-RS', {
                      style: 'currency',
                      currency: 'RSD',
                    }).format(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-clay-800 mb-4">
              Informacije o kupcu
            </h2>
            <div className="space-y-2 text-clay-700">
              <p>
                <span className="font-semibold">Ime:</span> {order.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {order.email}
              </p>
              <p>
                <span className="font-semibold">Telefon:</span> {order.phone}
              </p>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-clay-800 mb-4">
              Adresa za dostavu
            </h2>
            <div className="space-y-2 text-clay-700">
              <p>{order.shippingAddress}</p>
              <p>
                {order.shippingCity} {order.shippingZip}
              </p>
              <p>
                <span className="font-semibold">Način dostave:</span>{' '}
                {order.shippingMethod === 'express' ? 'Ekspres' : 'Standardna'}
              </p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-clay-800 mb-4">
                Napomene
              </h2>
              <p className="text-clay-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Order Summary & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-semibold text-clay-800 mb-4">
              Pregled
            </h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-clay-700">
                <span>Međuzbir:</span>
                <span>
                  {new Intl.NumberFormat('sr-RS', {
                    style: 'currency',
                    currency: 'RSD',
                  }).format(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-clay-700">
                <span>Dostava:</span>
                <span>
                  {new Intl.NumberFormat('sr-RS', {
                    style: 'currency',
                    currency: 'RSD',
                  }).format(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-clay-800 pt-2 border-t border-clay-200">
                <span>Ukupno:</span>
                <span>
                  {new Intl.NumberFormat('sr-RS', {
                    style: 'currency',
                    currency: 'RSD',
                  }).format(order.total)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-clay-700 mb-2">
                  Status porudžbine:
                </p>
                <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
              </div>
              <div>
                <p className="text-sm font-semibold text-clay-700 mb-2">
                  Status plaćanja:
                </p>
                <UpdateOrderStatus
                  orderId={order.id}
                  currentStatus={order.paymentStatus}
                  type="payment"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-clay-200 text-sm text-clay-600">
              <p>
                <span className="font-semibold">Datum:</span>{' '}
                {new Date(order.createdAt).toLocaleString('sr-RS')}
              </p>
              <p>
                <span className="font-semibold">Način plaćanja:</span>{' '}
                {order.paymentMethod === 'card'
                  ? 'Kartica online'
                  : order.paymentMethod === 'cash'
                  ? 'Pouzećem'
                  : 'Bankovni transfer'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

