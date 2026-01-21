import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@grncarijasavic.com' },
    update: {},
    create: {
      email: 'admin@grncarijasavic.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'posude' },
      update: {},
      create: {
        name: 'Posude',
        slug: 'posude',
        description: 'Različite posude za svakodnevnu upotrebu',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'vaze' },
      update: {},
      create: {
        name: 'Vaze',
        slug: 'vaze',
        description: 'Ukrasne vaze za cveće',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tanjiri' },
      update: {},
      create: {
        name: 'Tanjiri',
        slug: 'tanjiri',
        description: 'Tanjiri i servisi za jelo',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'lonci' },
      update: {},
      create: {
        name: 'Lonci',
        slug: 'lonci',
        description: 'Lonci za kuvanje',
      },
    }),
  ])

  // Create sample products
  const products = [
    {
      name: 'Tradicionalna Posuda za Vodu',
      slug: 'tradicionalna-posuda-za-vodu',
      description: 'Rukom izrađena posuda od terakote, savršena za čuvanje vode. Tradicionalni dizajn koji se prenosi kroz generacije.',
      price: 2500,
      stock: 15,
      images: JSON.stringify([
        '/images/products/posuda-voda-1.jpg',
        '/images/products/posuda-voda-2.jpg',
      ]),
      dimensions: '25x25x30 cm',
      material: 'Terakota',
      categoryId: categories[0].id,
      featured: true,
    },
    {
      name: 'Ukrasna Vaza sa Rezbarom',
      slug: 'ukrasna-vaza-sa-rezbarom',
      description: 'Elegantna vaza sa tradicionalnim rezbarom, idealna za cveće ili kao dekorativni predmet.',
      price: 3200,
      stock: 8,
      images: JSON.stringify([
        '/images/products/vaza-rezbar-1.jpg',
        '/images/products/vaza-rezbar-2.jpg',
      ]),
      dimensions: '15x15x35 cm',
      material: 'Terakota',
      categoryId: categories[1].id,
      featured: true,
    },
    {
      name: 'Servis za Jelo - 6 Komada',
      slug: 'servis-za-jelo-6-komada',
      description: 'Komplet tanjira i činija za 6 osoba. Rukom izrađen sa pažljivošću i ljubavlju.',
      price: 4500,
      stock: 12,
      images: JSON.stringify([
        '/images/products/servis-6-1.jpg',
        '/images/products/servis-6-2.jpg',
      ]),
      dimensions: 'Tanjir: 25 cm, Činija: 12 cm',
      material: 'Terakota',
      categoryId: categories[2].id,
      featured: true,
    },
    {
      name: 'Lonac za Kuvanje - Srednji',
      slug: 'lonac-za-kuvanje-srednji',
      description: 'Praktičan lonac od terakote, idealan za kuvanje na šporetu ili u pećnici.',
      price: 2800,
      stock: 10,
      images: JSON.stringify([
        '/images/products/lonac-srednji-1.jpg',
        '/images/products/lonac-srednji-2.jpg',
      ]),
      dimensions: '20x20x15 cm',
      material: 'Terakota',
      categoryId: categories[3].id,
      featured: false,
    },
    {
      name: 'Mala Posuda za Začine',
      slug: 'mala-posuda-za-zacine',
      description: 'Set od 4 male posude za čuvanje začina. Praktičan i lep dodatak kuhinji.',
      price: 1800,
      stock: 20,
      images: JSON.stringify([
        '/images/products/posuda-zacini-1.jpg',
      ]),
      dimensions: '10x10x8 cm',
      material: 'Terakota',
      categoryId: categories[0].id,
      featured: false,
    },
    {
      name: 'Velika Ukrasna Vaza',
      slug: 'velika-ukrasna-vaza',
      description: 'Impozantna vaza visine 50cm, savršena kao centralni dekorativni element.',
      price: 5500,
      stock: 5,
      images: JSON.stringify([
        '/images/products/vaza-velika-1.jpg',
        '/images/products/vaza-velika-2.jpg',
      ]),
      dimensions: '20x20x50 cm',
      material: 'Terakota',
      categoryId: categories[1].id,
      featured: true,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('Seed data created successfully!')
  console.log('Admin credentials:')
  console.log('Email: admin@grncarijasavic.com')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

