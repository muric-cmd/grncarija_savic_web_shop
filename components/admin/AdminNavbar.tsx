'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function AdminNavbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-clay-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="text-xl font-bold">
              Admin Panel
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-md ${pathname === '/admin'
                    ? 'bg-clay-700'
                    : 'hover:bg-clay-700'
                  }`}
              >
                Pregled
              </Link>
              <Link
                href="/admin/products"
                className={`px-3 py-2 rounded-md ${pathname?.startsWith('/admin/products')
                    ? 'bg-clay-700'
                    : 'hover:bg-clay-700'
                  }`}
              >
                Proizvodi
              </Link>
              <Link
                href="/admin/orders"
                className={`px-3 py-2 rounded-md ${pathname?.startsWith('/admin/orders')
                    ? 'bg-clay-700'
                    : 'hover:bg-clay-700'
                  }`}
              >
                Porudžbine
              </Link>
              <Link
                href="/admin/categories"
                className={`px-3 py-2 rounded-md ${pathname?.startsWith('/admin/categories')
                    ? 'bg-clay-700'
                    : 'hover:bg-clay-700'
                  }`}
              >
                Kategorije
              </Link>
              <Link
                href="/admin/blog"
                className={`px-3 py-2 rounded-md ${pathname?.startsWith('/admin/blog')
                    ? 'bg-clay-700'
                    : 'hover:bg-clay-700'
                  }`}
              >
                Blog
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-clay-200 hover:text-white"
            >
              Nazad na sajt
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-clay-600 hover:bg-clay-700 px-4 py-2 rounded-md"
            >
              Odjavi se
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

