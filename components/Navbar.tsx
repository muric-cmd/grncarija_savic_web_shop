'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  const { getItemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const itemCount = getItemCount()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-clay-800">
              Grnčarija Savić
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-clay-700 hover:text-clay-900 font-medium"
            >
              Početna
            </Link>
            <Link
              href="/products"
              className="text-clay-700 hover:text-clay-900 font-medium"
            >
              Proizvodi
            </Link>
            <Link
              href="/blog"
              className="text-clay-700 hover:text-clay-900 font-medium"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-clay-700 hover:text-clay-900 font-medium"
            >
              O Nama
            </Link>
            <Link
              href="/contact"
              className="text-clay-700 hover:text-clay-900 font-medium"
            >
              Kontakt
            </Link>

            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="text-clay-700 hover:text-clay-900 font-medium border border-clay-300 rounded-md px-3 py-1 bg-clay-50"
              >
                Dashboard
              </Link>
            )}

            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-clay-600">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-clay-700 hover:text-clay-900 font-medium"
                >
                  Odjavi se
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-clay-700 hover:text-clay-900 font-medium"
                >
                  Prijavi se
                </Link>
              </div>
            )}

            <Link
              href="/cart"
              className="relative text-clay-700 hover:text-clay-900 font-medium"
            >
              Korpa
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-clay-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-clay-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/"
              className="block text-clay-700 hover:text-clay-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Početna
            </Link>
            <Link
              href="/products"
              className="block text-clay-700 hover:text-clay-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Proizvodi
            </Link>
            <Link
              href="/blog"
              className="block text-clay-700 hover:text-clay-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="block text-clay-700 hover:text-clay-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              O Nama
            </Link>
            <Link
              href="/contact"
              className="block text-clay-700 hover:text-clay-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kontakt
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="block text-clay-700 hover:text-clay-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <Link
              href="/cart"
              className="block text-clay-700 hover:text-clay-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Korpa {itemCount > 0 && `(${itemCount})`}
            </Link>
            {!session && (
              <Link
                href="/auth/login"
                className="block text-clay-700 hover:text-clay-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Prijavi se
              </Link>
            )}
            {session && (
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' })
                  setMobileMenuOpen(false)
                }}
                className="block text-left w-full text-clay-700 hover:text-clay-900 font-medium"
              >
                Odjavi se
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

