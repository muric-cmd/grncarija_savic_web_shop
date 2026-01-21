import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [
    totalOrders,
    pendingOrders,
    totalProducts,
    lowStockProducts,
    totalRevenue,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.product.count({ where: { active: true } }),
    prisma.product.count({ where: { stock: { lt: 10 }, active: true } }),
    prisma.order.aggregate({
      where: { paymentStatus: 'paid' },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }),
  ])

  const revenue = totalRevenue._sum.total || 0

  return (
    <div>
      <h1 className="text-4xl font-bold text-clay-800 mb-8">Admin Pregled</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-clay-600 mb-2">
            Ukupno Porudžbina
          </h3>
          <p className="text-3xl font-bold text-clay-800">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-clay-600 mb-2">
            Na čekanju
          </h3>
          <p className="text-3xl font-bold text-clay-800">{pendingOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-clay-600 mb-2">
            Proizvoda
          </h3>
          <p className="text-3xl font-bold text-clay-800">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-clay-600 mb-2">
            Ukupan Prihod
          </h3>
          <p className="text-3xl font-bold text-clay-800">
            {new Intl.NumberFormat('sr-RS', {
              style: 'currency',
              currency: 'RSD',
            }).format(revenue)}
          </p>
        </div>
      </div>

      {lowStockProducts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">
            <strong>Upozorenje:</strong> {lowStockProducts} proizvoda ima malo
            zaliha (&lt;10 komada)
          </p>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-clay-800">
            Najnovije Porudžbine
          </h2>
          <Link
            href="/admin/orders"
            className="text-clay-600 hover:text-clay-700 font-medium"
          >
            Vidi sve →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-clay-200">
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
                  Datum
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-clay-100">
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-clay-600 hover:text-clay-700 font-medium"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-clay-700">{order.name}</td>
                  <td className="py-3 px-4 text-clay-700">
                    {new Intl.NumberFormat('sr-RS', {
                      style: 'currency',
                      currency: 'RSD',
                    }).format(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-clay-100 text-clay-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-clay-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('sr-RS')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

