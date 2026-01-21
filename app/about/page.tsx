export const metadata = {
  title: 'O Nama - Grnčarija Savić',
  description: 'Saznajte više o našoj porodičnoj tradiciji i procesu izrade keramike',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-clay-800 mb-8 text-center">
        O Nama
      </h1>

      <div className="prose max-w-none space-y-8">
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-semibold text-clay-800 mb-4">
            Porodična Tradicija
          </h2>
          <p className="text-lg text-clay-700 mb-4">
            Grnčarija Savić je porodična radionica koja prenosi veštinu
            tradicionalne grnčarije kroz generacije. Naša priča počinje pre više
            od pola veka, kada je naš deda započeo sa izradom keramike koristeći
            tradicionalne tehnike koje su se prenosile sa kolena na koleno.
          </p>
          <p className="text-lg text-clay-700">
            Danas, mi nastavljamo tu tradiciju, kombinujući tradicionalne
            metode sa modernim pristupom, kako bismo stvorili proizvode koji su
            ne samo funkcionalni već i lepi dekorativni elementi vašeg doma.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-semibold text-clay-800 mb-4">
            Naš Proces
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-clay-800 mb-2">
                1. Priprema Gline
              </h3>
              <p className="text-clay-700">
                Pažljivo biramo prirodnu glinu i pripremamo je za oblikovanje.
                Svaki komad gline je ručno pripremljen i proveren pre upotrebe.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-clay-800 mb-2">
                2. Oblikovanje
              </h3>
              <p className="text-clay-700">
                Koristimo tradicionalne tehnike oblikovanja - ručno oblikovanje
                i lončarsko kolo. Svaki proizvod je jedinstven i nosi pečat
                majstora koji ga je napravio.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-clay-800 mb-2">
                3. Sušenje
              </h3>
              <p className="text-clay-700">
                Proizvodi se suše prirodno, bez žurbe, kako bi se osigurala
                kvalitetna struktura i trajnost.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-clay-800 mb-2">
                4. Pečenje
              </h3>
              <p className="text-clay-700">
                Pečemo u tradicionalnoj peći na drva, što daje našim proizvodima
                jedinstvenu boju i karakter.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-clay-800 mb-2">
                5. Završna Obrađa
              </h3>
              <p className="text-clay-700">
                Svaki proizvod je pažljivo pregledan i završen, sa pažnjom na
                svaki detalj.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-semibold text-clay-800 mb-4">
            Naša Filozofija
          </h2>
          <p className="text-lg text-clay-700 mb-4">
            Verujemo da svaki proizvod treba da bude izrađen sa pažnjom,
            ljubavlju i poštovanjem prema tradiciji. Naša keramika nije samo
            funkcionalna - ona je deo naše kulture i istorije.
          </p>
          <p className="text-lg text-clay-700">
            Kada kupite naš proizvod, ne dobijate samo predmet - dobijate deo
            naše priče i tradicije koja se prenosi kroz generacije.
          </p>
        </section>
      </div>
    </div>
  )
}

