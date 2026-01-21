export const metadata = {
  title: 'Politika Privatnosti - Grnčarija Savić',
  description: 'Politika privatnosti i zaštita podataka',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-clay-800 mb-8">Politika Privatnosti</h1>

      <div className="prose max-w-none bg-white rounded-lg shadow-md p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            1. Prikupljanje Podataka
          </h2>
          <p className="text-clay-700">
            Prikupljamo podatke koje nam vi direktno pružate prilikom kreiranja
            porudžbine, kontaktiranja ili registracije. Ovi podaci uključuju ime,
            email adresu, telefonski broj, adresu za dostavu i druge informacije
            potrebne za izvršenje porudžbine.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            2. Korišćenje Podataka
          </h2>
          <p className="text-clay-700">
            Vaše podatke koristimo isključivo za:
          </p>
          <ul className="list-disc pl-6 text-clay-700 space-y-2">
            <li>Izvršenje i isporuku vaših porudžbina</li>
            <li>Komunikaciju sa vama u vezi sa porudžbinama</li>
            <li>Poboljšanje naših usluga</li>
            <li>Slanje informacija o proizvodima i promocijama (samo sa vašom saglasnošću)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            3. Zaštita Podataka
          </h2>
          <p className="text-clay-700">
            Preduzimamo sve potrebne mere da zaštitimo vaše lične podatke od
            neovlašćenog pristupa, gubitka ili uništenja. Koristimo sigurne
            metode za prenos i čuvanje podataka.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            4. Deljenje Podataka
          </h2>
          <p className="text-clay-700">
            Ne delimo vaše lične podatke sa trećim stranama, osim kada je to
            neophodno za izvršenje porudžbine (npr. kurirske službe) ili kada
            to zahteva zakon.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            5. Vaša Prava
          </h2>
          <p className="text-clay-700">
            Imate pravo da:
          </p>
          <ul className="list-disc pl-6 text-clay-700 space-y-2">
            <li>Pristupite svojim ličnim podacima</li>
            <li>Ispravite netačne podatke</li>
            <li>Zatražite brisanje vaših podataka</li>
            <li>Ograničite obradu vaših podataka</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            6. Kontakt
          </h2>
          <p className="text-clay-700">
            Za sva pitanja u vezi sa privatnošću, kontaktirajte nas na:
            info@grncarija-savic.com
          </p>
        </section>

        <section>
          <p className="text-sm text-clay-600 italic">
            Poslednja izmena: {new Date().toLocaleDateString('sr-RS')}
          </p>
        </section>
      </div>
    </div>
  )
}

