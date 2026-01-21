export const metadata = {
  title: 'Uslovi Korišćenja - Grnčarija Savić',
  description: 'Uslovi korišćenja online prodavnice',
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-clay-800 mb-8">Uslovi Korišćenja</h1>

      <div className="prose max-w-none bg-white rounded-lg shadow-md p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            1. Prihvatanje Uslova
          </h2>
          <p className="text-clay-700">
            Korišćenjem naše online prodavnice, prihvatate ove uslove korišćenja.
            Molimo vas da pažljivo pročitate ove uslove pre nego što napravite
            porudžbinu.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            2. Porudžbine
          </h2>
          <p className="text-clay-700">
            Sve porudžbine su predmet potvrde. Zadržavamo pravo da odbijemo ili
            otkažemo bilo koju porudžbinu. U slučaju otkazivanja, vraćamo
            uplaćeni iznos u potpunosti.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            3. Cene i Plaćanje
          </h2>
          <p className="text-clay-700">
            Sve cene su izražene u RSD i uključuju PDV. Zadržavamo pravo da
            promenimo cene u bilo kom trenutku. Plaćanje možete izvršiti
            karticom online, pouzećem ili bankovnim transferom.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            4. Dostava
          </h2>
          <p className="text-clay-700">
            Dostava se vrši na adresu koju navedete prilikom porudžbine. Vreme
            dostave zavisi od načina dostave koji izaberete. Ne snosimo odgovornost
            za kašnjenja koja su posledica grešaka u dostavi ili drugih okolnosti
            van naše kontrole.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            5. Povraćaj i Zamena
          </h2>
          <p className="text-clay-700">
            Pošto su naši proizvodi rukom izrađeni, svaki proizvod je jedinstven.
            U slučaju oštećenja tokom transporta, kontaktirajte nas u roku od 48
            sati od primitka. Vraćamo novac ili zamenjujemo proizvod u skladu sa
            vašim zahtevom.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            6. Intelektualna Svojina
          </h2>
          <p className="text-clay-700">
            Sav sadržaj na ovom sajtu, uključujući slike, tekstove i dizajn, je
            vlasništvo Grnčarije Savić i zaštićen je autorskim pravima.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            7. Ograničenje Odgovornosti
          </h2>
          <p className="text-clay-700">
            Ne snosimo odgovornost za bilo kakve indirektne, slučajne ili posledične
            štete koje mogu nastati korišćenjem naših proizvoda ili usluga.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            8. Izmene Uslova
          </h2>
          <p className="text-clay-700">
            Zadržavamo pravo da u bilo kom trenutku izmenimo ove uslove. Sve
            izmene će biti objavljene na ovoj stranici.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-clay-800 mb-4">
            9. Kontakt
          </h2>
          <p className="text-clay-700">
            Za sva pitanja u vezi sa uslovima korišćenja, kontaktirajte nas na:
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

