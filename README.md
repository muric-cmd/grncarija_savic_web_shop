# Grnčarija Savić - Online Store

Potpuna e-commerce aplikacija za tradicionalnu grnčariju sa rukom izrađenom keramikom.

## 🚀 Funkcionalnosti

### Storefront
- ✅ Početna stranica sa istaknutim proizvodima
- ✅ Katalog proizvoda sa kategorijama
- ✅ Detaljne stranice proizvoda sa galerijom slika
- ✅ Pretraga i filtriranje proizvoda
- ✅ Shopping korpa sa perzistentnim čuvanjem
- ✅ Checkout proces sa validacijom
- ✅ Potvrda porudžbine

### Plaćanje i Dostava
- ✅ Kartica online (Stripe)
- ✅ Pouzećem
- ✅ Bankovni transfer
- ✅ Kalkulacija troškova dostave
- ✅ Praćenje statusa porudžbine

### Admin Panel
- ✅ Autentifikacija admin korisnika
- ✅ Pregled statistika i porudžbina
- ✅ Upravljanje proizvodima
- ✅ Upravljanje porudžbinama i statusima
- ✅ Upravljanje kategorijama

### Sadržaj
- ✅ O Nama stranica
- ✅ Kontakt stranica
- ✅ Politika Privatnosti
- ✅ Uslovi Korišćenja

## 🛠️ Tehnologije

- **Framework:** Next.js 14 (App Router)
- **Jezik:** TypeScript
- **Baza podataka:** SQLite (Prisma ORM)
- **Autentifikacija:** NextAuth.js
- **Plaćanje:** Stripe
- **Styling:** Tailwind CSS
- **State Management:** Zustand (za korpu)

## 📦 Instalacija

### Preduslovi

- **Windows 10/11**
- **Node.js 18+** (preuzmite sa https://nodejs.org)
- **npm** (dolazi sa Node.js)

### Koraci (Windows)

1. **Otvorite folder projekta u File Exploreru**

2. **Instalirajte zavisnosti:**

**Napomena:** Ako imate problema sa encoding-om zbog posebnih karaktera (ć) u imenu foldera, koristite jedan od sledećih načina:

**Opcija 1 - Koristite batch fajl (preporučeno):**
```cmd
install.bat
```

**Ako dobijete grešku "Cannot find module '../../package.json'":**

Ovo znači da je vaša npm instalacija oštećena. Probajte redom:

1. **Prvo pokušajte sa `install-direct.bat`** (koristi alternativne metode):
```cmd
install-direct.bat
```

2. **Ako to ne radi, pokrenite `fix-npm.bat`** (može takođe da ima grešku, ali pokušajte):
```cmd
fix-npm.bat
```

3. **Ako ništa ne radi, ručno u Command Prompt-u (kao Administrator):**
```cmd
cd /d "C:\Users\lazar\OneDrive\Desktop\grnčarija_savić_web_shop"
"C:\Program Files\nodejs\npm.cmd" install
```

4. **Ili reinstalirajte Node.js** sa https://nodejs.org

**Opcija 2 - Ručno u PowerShell-u:**
```powershell
# Postavite UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001

# Pronađite folder i pokrenite npm install
$folder = Get-ChildItem "C:\Users\lazar\OneDrive\Desktop" -Directory | Where-Object { $_.Name -like "*grn*" } | Select-Object -First 1
Set-Location $folder.FullName
npm install
```

**Opcija 3 - Direktno u CMD (Command Prompt):**
```cmd
cd /d "C:\Users\lazar\OneDrive\Desktop\grnčarija_savić_web_shop"
npm install
```

**Napomena:** Ako imate problema sa encoding-om zbog posebnih karaktera u imenu foldera, koristite batch fajlove iznad.

3. **Kreirajte `.env` fajl:**

**Najlakše - pokrenite batch fajl:**
```cmd
setup-env.bat
```

**Ili ručno u CMD:**
```cmd
copy .env.example .env
```

**Ili u PowerShell:**
```powershell
Copy-Item .env.example .env
```

4. **Konfigurišite environment varijable u `.env`:**
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Stripe (opciono za online plaćanje)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email (opciono)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@grncarija-savic.com
```

5. **Kreirajte bazu podataka:**
```cmd
npx prisma db push
```

6. **Popunite bazu sa početnim podacima:**
```cmd
npm run db:seed
```

Ovo će kreirati:
- Admin korisnika (email: `admin@grncarijasavic.com`, lozinka: `admin123`)
- Kategorije proizvoda
- Primer proizvoda

7. **Pokrenite development server:**
```cmd
npm run dev
```

8. **Otvorite aplikaciju:**
   - Storefront: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Admin login: admin@grncarijasavic.com / admin123

## 📁 Struktura Projekta

```
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel stranice
│   ├── api/                # API rute
│   ├── products/          # Stranice proizvoda
│   ├── cart/               # Korpa
│   ├── checkout/           # Checkout proces
│   ├── about/              # O Nama
│   ├── contact/            # Kontakt
│   └── ...
├── components/             # React komponente
│   ├── admin/             # Admin komponente
│   └── ...
├── context/               # React Context (Cart)
├── lib/                   # Utility funkcije
│   ├── prisma.ts          # Prisma client
│   └── auth.ts            # NextAuth konfiguracija
├── prisma/                # Prisma schema i seed
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed podaci
└── public/                # Statički fajlovi
```

## 🔐 Admin Panel

### Prijava
- URL: `/admin/login`
- Email: `admin@grncarijasavic.com`
- Lozinka: `admin123`

**VAŽNO:** Promenite admin lozinku nakon prve prijave!

### Funkcionalnosti
- **Pregled:** Statistike, najnovije porudžbine
- **Proizvodi:** Dodavanje, izmena, brisanje proizvoda
- **Porudžbine:** Pregled i upravljanje statusima
- **Kategorije:** Upravljanje kategorijama

## 💳 Stripe Integracija

Za online plaćanje karticom:

1. Kreirajte Stripe nalog na https://stripe.com
2. Uzmite test API ključeve iz Stripe Dashboard
3. Dodajte ključeve u `.env` fajl
4. Konfigurišite webhook endpoint u Stripe Dashboard:
   - URL: `https://your-domain.com/api/webhook/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## 📧 Email Notifikacije

Za slanje email notifikacija (opciono):

1. Kreirajte nalog na Resend (https://resend.com) ili koristite drugi email servis
2. Dodajte API ključ u `.env`
3. Implementirajte email funkcije u API rutama (trenutno su komentarisane)

## 🚢 Deployment

### Vercel (Preporučeno)

1. Push kod na GitHub
2. Importujte projekat u Vercel
3. Dodajte environment varijable
4. Konfigurišite build komandu: `npm run build`
5. Deploy!

### Druge Platforme

Projekat može biti deploy-ovan na bilo koju platformu koja podržava Next.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

**Napomena:** Za produkciju, promenite SQLite na PostgreSQL ili MySQL.

## 🔄 Migracija na PostgreSQL

Za produkciju, preporučeno je koristiti PostgreSQL:

1. Promenite `provider` u `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Ažurirajte `DATABASE_URL` u `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/grncarija_savic"
```

3. Pokrenite migracije:
```cmd
npx prisma migrate dev --name init
```

## 📝 Dodavanje Proizvoda

### Kroz Admin Panel
1. Prijavite se u admin panel
2. Idite na "Proizvodi" → "Dodaj Proizvod"
3. Popunite formu i sačuvajte

### Kroz Seed
Dodajte proizvode u `prisma/seed.ts` i pokrenite:
```cmd
npm run db:seed
```

## 🎨 Prilagođavanje

### Boje
Boje se mogu prilagoditi u `tailwind.config.ts`:
- `clay-*`: Glavne boje (terakota, bež, braon)
- `earth-*`: Dodatne zemljane nijanse

### Slike Proizvoda
Dodajte slike u `public/images/products/` i referencirajte ih u proizvodima.

### Tekstovi
Svi tekstovi su na srpskom jeziku i mogu se lako prilagoditi u komponentama.

## 🐛 Troubleshooting

### Problem sa bazom podataka
```cmd
REM Obrišite bazu i kreirajte ponovo
del prisma\dev.db
npx prisma db push
npm run db:seed
```

### Problem sa autentifikacijom
Proverite da li je `NEXTAUTH_SECRET` postavljen u `.env` fajlu.

### Problem sa Stripe
Proverite da li su svi Stripe ključevi ispravno postavljeni i da li koristite test ključeve u development-u.

## 📄 Licenca

Ovaj projekat je kreiran za Grnčariju Savić.

## 🤝 Podrška

Za pitanja i podršku, kontaktirajte: info@grncarija-savic.com

---

**Napomena:** Ovo je kompletan, production-ready e-commerce sistem. Pre deploy-a u produkciju, obavezno:
- Promenite admin lozinku
- Konfigurišite produkcijsku bazu podataka
- Dodajte prave Stripe ključeve
- Konfigurišite email servis
- Dodajte prave slike proizvoda
- Ažurirajte kontakt informacije

