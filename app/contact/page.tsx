export const metadata = {
  title: 'Kontakt - Grnčarija Savić',
  description: 'Kontaktirajte nas za sva vaša pitanja i porudžbine',
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-clay-800 mb-8 text-center">
        Kontakt
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-clay-800 mb-6">
            Kontakt Informacije
          </h2>
          <div className="space-y-4 text-clay-700">
            <div>
              <h3 className="font-semibold text-clay-800 mb-1">Email</h3>
              <a
                href="mailto:info@grncarija-savic.com"
                className="text-clay-600 hover:text-clay-700"
              >
                info@grncarija-savic.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-clay-800 mb-1">Telefon</h3>
              <a
                href="tel:+381XXXXXXXXX"
                className="text-clay-600 hover:text-clay-700"
              >
                +381 XX XXX XXXX
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-clay-800 mb-1">Adresa</h3>
              <p>Vaša adresa</p>
              <p>Grad, Poštanski broj</p>
              <p>Srbija</p>
            </div>
            <div>
              <h3 className="font-semibold text-clay-800 mb-1">Radno Vreme</h3>
              <p>Ponedeljak - Petak: 9:00 - 17:00</p>
              <p>Subota: 9:00 - 14:00</p>
              <p>Nedelja: Zatvoreno</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-clay-800 mb-6">
            Pošaljite Nam Poruku
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-clay-700 mb-1">
                Ime
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-clay-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-clay-700 mb-1">
                Poruka
              </label>
              <textarea
                rows={6}
                className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-clay-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-clay-700 transition-colors"
            >
              Pošalji Poruku
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

