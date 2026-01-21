import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-4xl font-bold text-clay-800 mb-8">Porudžbine</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-clay-50">
            <tr>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Broj
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Kupac
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Ukupno
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Status
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Plaćanje
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Datum
              </th>
              <th className="text-left py-3 px-4 text-clay-700 font-semibold">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-clay-100">
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-clay-600 hover:text-clay-700 font-medium"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="py-3 px-4 text-clay-700">
                  <div>
                    <div className="font-medium">{order.name}</div>
                    <div className="text-sm text-clay-600">{order.email}</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-clay-700">
                  {new Intl.NumberFormat('sr-RS', {
                    style: 'currency',
                    currency: 'RSD',
                  }).format(order.total)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm capitalize ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'paid'
                        ? 'bg-purple-100 text-purple-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm capitalize ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="py-3 px-4 text-clay-600 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('sr-RS')}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-clay-600 hover:text-clay-700 text-sm"
                  >
                    Detalji
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

