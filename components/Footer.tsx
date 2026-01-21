import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-clay-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Grnčarija Savić</h3>
            <p className="text-clay-200">
              Tradicionalna rukom izrađena keramika sa pažnjom i ljubavlju.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigacija</h4>
            <ul className="space-y-2 text-clay-200">
              <li>
                <Link href="/" className="hover:text-white">
                  Početna
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white">
                  Proizvodi
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  O Nama
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Informacije</h4>
            <ul className="space-y-2 text-clay-200">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Politika Privatnosti
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Uslovi Korišćenja
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Korisnički nalog</h4>
            <ul className="space-y-2 text-clay-200">
              <li>
                <Link href="/auth/login" className="hover:text-white">
                  Prijava
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white">
                  Registracija
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-clay-200">
              <li>Email: info@grncarija-savic.com</li>
              <li>Telefon: +381 XX XXX XXXX</li>
              <li>Adresa: [Vaša adresa]</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-clay-700 mt-8 pt-8 text-center text-clay-200">
          <p>&copy; {new Date().getFullYear()} Grnčarija Savić. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  )
}

