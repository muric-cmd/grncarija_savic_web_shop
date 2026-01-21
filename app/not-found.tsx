import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-clay-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-clay-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-clay-700 mb-4">
          Stranica nije pronađena
        </h2>
        <p className="text-clay-600 mb-8">
          Stranica koju tražite ne postoji ili je uklonjena.
        </p>
        <Link
          href="/"
          className="bg-clay-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-clay-700 transition-colors inline-block"
        >
          Nazad na početnu
        </Link>
      </div>
    </div>
  )
}

